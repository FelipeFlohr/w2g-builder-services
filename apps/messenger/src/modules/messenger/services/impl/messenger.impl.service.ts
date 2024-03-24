import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { DiscordDelimitationMessageDTO } from "src/models/discord-demilitation-message.dto";
import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { DiscordAMQPServiceProvider } from "src/modules/discord-amqp/providers/discord-amqp-service.provider";
import { DiscordAMQPService } from "src/modules/discord-amqp/services/discord-amqp.service";
import { DiscordSlashCommandDTO } from "src/modules/discord/models/discord-slash-command.dto";
import { DiscordServiceProvider } from "src/modules/discord/providers/discord-service.provider";
import { DiscordService } from "src/modules/discord/services/discord.service";
import { CollectionUtils } from "src/utils/collection.utils";
import { LoggerUtils } from "src/utils/logger.utils";
import { AddListenerCommand } from "../../commands/add-listener.command";
import { MarkDelimitationCommand } from "../../commands/delimitation-message.command";
import { RemoveListenerCommand } from "../../commands/remove-listener.command";
import { DiscordDelimitationMessageEntity } from "../../entities/discord-delimitation-message.entity";
import { DiscordListenerEntity } from "../../entities/discord-listener.entity";
import { DelimitationMessageAlreadyExistError } from "../../errors/delimitation-message-already-exist.error";
import { MessageNotFoundError } from "../../errors/message-not-found.error";
import { OnMessageCreatedListener } from "../../listeners/on-message-created.listener";
import { OnMessageDeletedListener } from "../../listeners/on-message-deleted.listener";
import { OnMessageUpdatedListener } from "../../listeners/on-message-updated.listener";
import { DiscordDelimitationMessageRepositoryProvider } from "../../providers/discord-delimitation-message-repository.provider";
import { DiscordListenerRepositoryProvider } from "../../providers/discord-listener-repository.provider";
import { DiscordMessageRepositoryProvider } from "../../providers/discord-message-repository.provider";
import { DiscordDelimitationMessageRepository } from "../../repositories/discord-delimitation-message.repository";
import { DiscordListenerRepository } from "../../repositories/discord-listener.repository";
import { DiscordMessageRepository } from "../../repositories/discord-message.repository";
import { MessengerService } from "../messenger.service";

@Injectable()
export class MessengerServiceImpl implements MessengerService, OnModuleInit {
  private readonly discordService: DiscordService;
  private readonly discordAMQPService: DiscordAMQPService;
  private readonly listenerRepository: DiscordListenerRepository;
  private readonly delimitationRepository: DiscordDelimitationMessageRepository;
  private readonly messageRepository: DiscordMessageRepository;
  private readonly commands: Array<DiscordSlashCommandDTO>;
  private readonly logger = LoggerUtils.from(MessengerServiceImpl);

  private static readonly FETCH_LIMIT = 1500;

  public constructor(
    @Inject(DiscordServiceProvider) discordService: DiscordService,
    @Inject(DiscordAMQPServiceProvider) discordAMQPService: DiscordAMQPService,
    @Inject(DiscordListenerRepositoryProvider) listenerRepository: DiscordListenerRepository,
    @Inject(DiscordDelimitationMessageRepositoryProvider) delimitationRepository: DiscordDelimitationMessageRepository,
    @Inject(DiscordMessageRepositoryProvider) messageRepository: DiscordMessageRepository,
  ) {
    this.discordService = discordService;
    this.discordAMQPService = discordAMQPService;
    this.listenerRepository = listenerRepository;
    this.delimitationRepository = delimitationRepository;
    this.messageRepository = messageRepository;
    this.commands = [new AddListenerCommand(this), new MarkDelimitationCommand(this), new RemoveListenerCommand(this)];
  }

  public async onModuleInit(): Promise<void> {
    const bootstrapMessages = await this.cacheAllMessages();
    await this.sendManyBootstrapMessages(bootstrapMessages);
    await this.sendManyDelimitationMessages();
    this.addMessagesListeners();
    this.addSlashCommandToInteraction();
  }

  public async listenerExistsByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean> {
    return await this.listenerRepository.existsByChannelIdAndGuildId(channelId, guildId);
  }

  public async saveListenerByChannelIdAndGuildId(channelId: string, guildId: string): Promise<DiscordListenerEntity> {
    const listener = await this.listenerRepository.saveListenerAndFlush(channelId, guildId);
    this.cacheMessageFromListener(listener);
    return listener;
  }

  public async deleteListenerByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean> {
    return await this.listenerRepository.deleteListenerByChannelIdAndGuildId(channelId, guildId);
  }

  public async setupSlashCommands(): Promise<void> {
    await CollectionUtils.asyncForEach(
      this.commands,
      async (command) => await this.discordService.addSlashCommandToAllGuilds(command),
    );
  }

  public async saveMessage(message: DiscordMessageDTO): Promise<void> {
    await this.messageRepository.upsert(message);
    await this.discordAMQPService.sendCreatedMessage(message);
  }

  public async updateMessage(message: DiscordMessageDTO): Promise<void> {
    await this.messageRepository.upsert(message);
    await this.discordAMQPService.sendUpdatedMessage(message);
  }

  public async deleteMessage(message: DiscordMessageDTO): Promise<void> {
    await this.messageRepository.deleteByMessageIdAndChannelIdAndGuildId(
      message.id,
      message.channelId,
      message.guildId,
    );
    await this.discordAMQPService.sendDeletedMessage(message);
  }

  public async saveDelimitationMessageByMessageIdAndChannelIdAndGuildId(
    messageId: string,
    channelId: string,
    guildId: string,
  ): Promise<DiscordDelimitationMessageEntity | undefined> {
    const message = await this.discordService.fetchMessageByIdAndGuildIdAndChannelId(messageId, channelId, guildId);
    if (message) {
      const delimitation = new DiscordDelimitationMessageDTO(new Date(), message);
      return await this.saveDelimitationMessage(delimitation);
    }
    throw new MessageNotFoundError(messageId);
  }

  public async deleteDelimitationMessageByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean> {
    return await this.delimitationRepository.deleteByGuildIdAndChannelId(channelId, guildId);
  }

  public async getDelimitationMessageUrlByChannelIdAndGuildId(
    channelId: string,
    guildId: string,
  ): Promise<string | undefined> {
    return await this.delimitationRepository.getMessageUrlByChannelIdAndGuildId(channelId, guildId);
  }

  private addMessagesListeners(): void {
    this.discordService.addMessageCreatedListener(new OnMessageCreatedListener(this));
    this.discordService.addMessageUpdatedListener(new OnMessageUpdatedListener(this));
    this.discordService.addMessageDeletedListener(new OnMessageDeletedListener(this));
  }

  private async cacheAllMessages(): Promise<Array<DiscordMessageDTO>> {
    const listeners = await this.listenerRepository.getAllListeners();
    const messages = await CollectionUtils.asyncMap(listeners, async (listener) =>
      this.cacheMessageFromListener(listener),
    );
    return messages.reduce((prev, curr) => [...prev, ...curr]);
  }

  private async cacheMessageFromListener(listener: DiscordListenerEntity): Promise<Array<DiscordMessageDTO>> {
    const delimitation = await this.delimitationRepository.getByChannelIdAndGuildId(
      listener.channelId,
      listener.guildId,
    );
    if (delimitation != undefined && delimitation.message != null) {
      return await this.cacheMessagesFromDelimitation(delimitation);
    }
    return [];
  }

  private async cacheMessagesFromDelimitation(
    delimitation: DiscordDelimitationMessageEntity,
  ): Promise<Array<DiscordMessageDTO>> {
    const promiseRes = await Promise.all([
      this.discordService.fetchMessageByIdAndGuildIdAndChannelId(
        delimitation.message.messageId,
        delimitation.message.channelId,
        delimitation.message.guildId,
      ) as Promise<DiscordMessageDTO>,
      this.discordService.fetchMessages({
        channel: delimitation.message.channelId,
        guild: delimitation.message.guildId,
        after: delimitation.message.messageId,
        limit: MessengerServiceImpl.FETCH_LIMIT,
      }),
    ]);

    const messages = [promiseRes[0], ...promiseRes[1]];
    await this.messageRepository.upsertMany(messages);
    return messages;
  }

  private addSlashCommandToInteraction(): void {
    for (const command of this.commands) {
      this.discordService.addSlashCommandToInteraction(command);
    }
  }

  private async saveDelimitationMessage(
    delimitation: DiscordDelimitationMessageDTO,
  ): Promise<DiscordDelimitationMessageEntity> {
    const messageIsAlreadyDelimitation = await this.delimitationRepository.existsByMessageIdAndChannelIdAndGuildId(
      delimitation.message.id,
      delimitation.message.channelId,
      delimitation.message.guildId,
    );
    if (messageIsAlreadyDelimitation) {
      throw new DelimitationMessageAlreadyExistError(delimitation.message.id);
    }

    const entity = await this.delimitationRepository.save(delimitation);
    this.discordAMQPService.sendDelimitationMessage(delimitation);
    this.cacheMessagesFromDelimitation(entity);
    return entity;
  }

  private async sendManyBootstrapMessages(messages: Array<DiscordMessageDTO>): Promise<void> {
    this.logger.log(`Sending ${messages.length} bootstrap message(s).`);
    for (const message of messages) {
      await this.discordAMQPService.sendBootstrapMessage(message);
    }
    this.logger.log(`Sent ${messages.length} bootstrap message(s).`);
  }

  private async sendManyDelimitationMessages(): Promise<void> {
    const delimitations = await this.delimitationRepository.getAll();
    const delimitationsDTO = delimitations.map((d) => d.toDTO());
    await CollectionUtils.asyncForEach(
      delimitationsDTO,
      async (message) => await this.discordAMQPService.sendDelimitationMessage(message),
    );
  }
}
