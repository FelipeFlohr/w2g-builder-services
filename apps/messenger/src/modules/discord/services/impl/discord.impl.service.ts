import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DiscordService } from "../discord.service";
import { DiscordClientService } from "../discord-client.service";
import { GuildFetchOptionsType } from "../../client/types/guild-fetch-options.type";
import { DiscordJsTextChannelImpl } from "../../client/business/impl/discord-js-text-channel.impl";
import { DiscordJsChannelImpl } from "../../client/business/impl/discord-js-channel.impl";
import { MessageFetchOptions } from "../../client/types/message-fetch-options.type";
import { DiscordGuild } from "../../client/business/discord-guild";
import { DiscordGuildInfo } from "../../client/business/discord-guild-info";
import { DiscordMessage } from "../../client/business/discord-message";
import { DiscordTextChannel } from "../../client/business/discord-text-channel";
import { DiscordTextChannelListenerDTO } from "../../models/discord-text-channel-listener.dto";
import { DiscordListenerRepository } from "../../repositories/discord-listener.repository";
import { DiscordDelimitationMessageRepository } from "../../repositories/discord-delimitation-message.repository";
import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordMessageRepository } from "../../repositories/discord-message.repository";
import { DiscordDelimitationMessageWithListenerDTO } from "../../models/discord-delimitation-message-with-listener.dto";
import { DiscordMessageAuthorDTO } from "../../models/discord-message-author.dto";
import { DiscordMessageAuthorRepository } from "../../repositories/discord-message-author.repository";
import { DiscordAMQPService } from "../../amqp/discord-amqp.service";
import { DiscordDelimitationMessageEntity } from "../../entities/discord-delimitation-message.entity";
import { StringUtils } from "src/utils/string-utils";
import { CollectionUtils } from "src/utils/collection-utils";
import { DiscordPersistedMessageStatusEnum } from "../../types/discord-persisted-message-status.enum";

@Injectable()
export class DiscordServiceImpl implements DiscordService {
  private readonly clientService: DiscordClientService;
  private readonly amqpService: DiscordAMQPService;
  private readonly listenerRepository: DiscordListenerRepository;
  private readonly delimitationRepository: DiscordDelimitationMessageRepository;
  private readonly messageRepository: DiscordMessageRepository;
  private readonly messageAuthorRepository: DiscordMessageAuthorRepository;

  private static readonly logger = new Logger(DiscordServiceImpl.name);

  public constructor(
    @Inject(DiscordClientService) clientService: DiscordClientService,
    @Inject(DiscordAMQPService) amqpService: DiscordAMQPService,
    @Inject(DiscordListenerRepository)
    listenerRepository: DiscordListenerRepository,
    @Inject(DiscordDelimitationMessageRepository)
    delimitationRepository: DiscordDelimitationMessageRepository,
    @Inject(DiscordMessageRepository) messageRepository: DiscordMessageRepository,
    @Inject(DiscordMessageAuthorRepository) messageAuthorRepository: DiscordMessageAuthorRepository,
  ) {
    this.clientService = clientService;
    this.amqpService = amqpService;
    this.listenerRepository = listenerRepository;
    this.delimitationRepository = delimitationRepository;
    this.messageRepository = messageRepository;
    this.messageAuthorRepository = messageAuthorRepository;
  }

  public async fetchGuilds(options?: GuildFetchOptionsType): Promise<DiscordGuildInfo[]> {
    return await this.clientService.client.fetchGuilds(options);
  }

  public async fetchGuildById(id: string): Promise<DiscordGuild | undefined> {
    return await this.clientService.client.fetchGuildById(id);
  }

  public async fetchTextChannels(guildId: string): Promise<DiscordTextChannel[]> {
    const guild = await this.clientService.client.fetchGuildById(guildId);
    if (guild) {
      const channels = await guild.fetchChannels();
      return channels
        .filter((channel) => channel.isTextChannel())
        .map((channel) => DiscordJsTextChannelImpl.fromChannel(channel as DiscordJsChannelImpl));
    }

    throw new NotFoundException();
  }

  public async fetchTextChannelById(guildId: string, channelId: string): Promise<DiscordTextChannel | undefined> {
    const guild = await this.fetchGuildById(guildId);
    if (guild) {
      const channel = await guild.fetchChannelById(channelId);
      if (channel?.isTextChannel()) {
        return DiscordJsTextChannelImpl.fromChannel(channel as DiscordJsChannelImpl);
      }
    }
  }

  public async fetchChannelMessages(options: MessageFetchOptions): Promise<DiscordMessage[]> {
    const channel = await this.fetchTextChannelById(options.guildId, options.channelId);

    if (channel) {
      return await channel.fetchMessages({
        after: options.after,
        amount: options.limit,
        around: options.around,
        before: options.before,
      });
    }
    return [];
  }

  public async fetchMessageById(
    guildId: string,
    channelId: string,
    messageId: string,
  ): Promise<DiscordMessage | undefined> {
    const channel = await this.fetchTextChannelById(guildId, channelId);
    if (channel) {
      return await channel.fetchMessageById(messageId);
    }
  }

  public async saveTextChannelListener(listener: DiscordTextChannelListenerDTO): Promise<void> {
    return await this.listenerRepository.saveListener(listener);
  }

  public async listenerExists(listener: DiscordTextChannelListenerDTO): Promise<boolean> {
    const res = await this.listenerRepository.findListenerByDTO(listener);
    return res != undefined;
  }

  public async deleteListener(listener: DiscordTextChannelListenerDTO): Promise<void> {
    await this.listenerRepository.deleteListener(listener);
  }

  public async fetchListeners(): Promise<DiscordTextChannelListenerDTO[]> {
    const res = await this.listenerRepository.findAllListeners();
    return res.map(DiscordTextChannelListenerDTO.fromEntity);
  }

  public async saveDelimitationMessage(message: DiscordMessage): Promise<void> {
    const messageDTO = message.toDTO();
    await this.delimitationRepository.saveDelimitation(messageDTO);
    await this.amqpService.sendDelimitationMessage(messageDTO);
  }

  public async saveMessage(message: DiscordMessageDTO, forceCreation?: boolean): Promise<number> {
    return await this.messageRepository.saveMessage(message, forceCreation);
  }

  public async updateMessageById(messageId: number, message: DiscordMessageDTO): Promise<void> {
    await this.messageRepository.updateMessageById(messageId, message);
  }

  public async softDeleteMessage(message: DiscordMessageDTO): Promise<void> {
    return await this.messageRepository.softDeleteMessage(message);
  }

  public async updateMessage(message: DiscordMessageDTO): Promise<void> {
    return await this.messageRepository.updateMessage(message);
  }

  public async fetchDelimitationMessagesWithListener(): Promise<DiscordDelimitationMessageWithListenerDTO[]> {
    return await this.delimitationRepository.getDelimitationMessagesWithListener();
  }

  public async updateMessageAuthorById(authorId: number, authorDTO: DiscordMessageAuthorDTO): Promise<void> {
    return await this.messageAuthorRepository.updateAuthorById(authorId, authorDTO);
  }

  public async saveAuthor(author: DiscordMessageAuthorDTO): Promise<number> {
    return await this.messageAuthorRepository.saveAuthor(author);
  }

  public async getDelimitationMessageLinkByGuildAndChannelId(
    guildId: string,
    channelId: string,
  ): Promise<string | undefined> {
    return await this.delimitationRepository.getDelimitationMessageLinkByGuildAndChannelId(guildId, channelId);
  }

  public async getDelimitationMessageByGuildAndChannelId(
    guildId: string,
    channelId: string,
  ): Promise<DiscordDelimitationMessageEntity> {
    return await this.delimitationRepository.getDelimitationMessageByGuildAndChannelId(guildId, channelId);
  }

  public async setupSlashCommands(): Promise<void> {
    return await this.clientService.setupSlashCommands();
  }

  public async cacheChannelMessages(
    isBootstrap: boolean,
    delimitationMessage: DiscordDelimitationMessageWithListenerDTO,
  ): Promise<void>;
  public async cacheChannelMessages(guildId: string, channelId: string, isBootstrap: boolean): Promise<void>;
  public async cacheChannelMessages(
    guildIdOrIsBootstrap: string | boolean,
    channelIdOrDelimitationMessage: string | DiscordDelimitationMessageWithListenerDTO,
    isBootstrap?: boolean,
  ): Promise<void> {
    let guildId: string;
    let channelId: string;
    let messageId: string;
    const bootstrap = isBootstrap ?? (typeof guildIdOrIsBootstrap === "boolean" && guildIdOrIsBootstrap);

    if (typeof guildIdOrIsBootstrap === "string" && typeof channelIdOrDelimitationMessage === "string") {
      guildId = guildIdOrIsBootstrap;
      channelId = channelIdOrDelimitationMessage;
      const messageFetched = await this.getDelimitationMessageByGuildAndChannelId(guildId, channelId);
      messageId = messageFetched.message.messageId;
    } else {
      const delimitationMessage = channelIdOrDelimitationMessage as DiscordDelimitationMessageWithListenerDTO;
      guildId = delimitationMessage.guildId;
      channelId = delimitationMessage.channelId;
      messageId = delimitationMessage.discordMessageId;
    }

    const messages = await this.fetchChannelMessages({
      guildId: guildId,
      channelId: channelId,
      after: messageId,
      limit: 1500,
    });
    DiscordServiceImpl.logger.debug(
      `Cached ${messages.length} ${StringUtils.pluralHandler(messages.length, "message")} for guild ${guildId}`,
    );

    await CollectionUtils.asyncForEach(messages, async (message) => {
      const messageDTO = message.toDTO();
      if (bootstrap) {
        await this.saveMessage(messageDTO);
        await this.amqpService.sendBootstrapMessage(messageDTO);
      } else {
        const messageStatus = await this.messageRepository.upsertMessage(messageDTO);
        switch (messageStatus) {
          case DiscordPersistedMessageStatusEnum.MESSAGE_CREATED:
            await this.amqpService.sendCreatedMessage(messageDTO);
            break;
          case DiscordPersistedMessageStatusEnum.MESSAGE_EXISTS_BUT_DIFFERENT_CONTENT:
            await this.amqpService.sendUpdatedMessage(messageDTO);
            break;
        }
      }
    });
  }

  public async sendDelimitationMessageViaAMQP(message: DiscordMessageDTO): Promise<void> {
    await this.amqpService.sendDelimitationMessage(message);
  }
}
