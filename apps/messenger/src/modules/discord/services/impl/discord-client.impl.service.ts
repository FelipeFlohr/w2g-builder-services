import { Inject, Injectable, OnModuleDestroy, OnModuleInit, forwardRef } from "@nestjs/common";
import { DiscordNetworkHandler } from "../../handlers/discord-network.handler";
import { DiscordClientService } from "../discord-client.service";
import { EnvironmentSettingsService } from "src/env/environment-settings.service";
import { DiscordJsClientImpl } from "../../client/impl/discord-js-client.impl";
import { LoggedDiscordClient } from "../../client/logged-discord-client";
import { DiscordTextChannelListener } from "../../listeners/discord-text-channel-listener";
import { DiscordJsTextChannelListener } from "../../listeners/impl/discord-js-text-channel-listener";
import { LoggedDiscordJsClientImpl } from "../../client/impl/logged-discord-js-client.impl";
import { DiscordJsMessageImpl } from "../../client/business/impl/discord-js-message.impl";
import { Client, Message } from "discord.js";
import { DiscordService } from "../discord.service";
import { DiscordCommandRepository } from "../../repositories/discord-command.repository";
import { DiscordSlashCommandHandler } from "../../handlers/discord-slash-command.handler";
import { DiscordJsSlashCommandInteractionImpl } from "../../client/business/impl/discord-js-slash-command-interaction.impl";
import { CollectionUtils } from "src/utils/collection-utils";
import { DiscordAMQPService } from "../../amqp/discord-amqp.service";
import { LoggerUtils } from "src/utils/logger-utils";
import { StringUtils } from "src/utils/string-utils";
import { DiscordMessage } from "../../client/business/discord-message";

@Injectable()
export class DiscordClientServiceImpl implements DiscordClientService, OnModuleInit, OnModuleDestroy {
  private readonly networkHandler: DiscordNetworkHandler;
  private readonly envService: EnvironmentSettingsService;
  private readonly service: DiscordService;
  private readonly commandsRepository: DiscordCommandRepository;
  private readonly commandHandler: DiscordSlashCommandHandler;
  private readonly amqpService: DiscordAMQPService;
  private _textChannelListener: DiscordTextChannelListener;
  private _client: LoggedDiscordClient;

  private static readonly logger = LoggerUtils.from(DiscordClientServiceImpl);

  public constructor(
    @Inject(DiscordNetworkHandler) networkHandler: DiscordNetworkHandler,
    @Inject(EnvironmentSettingsService) envService: EnvironmentSettingsService,
    @Inject(forwardRef(() => DiscordService)) service: DiscordService,
    @Inject(DiscordCommandRepository)
    commandsRepository: DiscordCommandRepository,
    @Inject(DiscordSlashCommandHandler)
    commandHandler: DiscordSlashCommandHandler,
    @Inject(DiscordAMQPService) amqpService: DiscordAMQPService,
  ) {
    this.networkHandler = networkHandler;
    this.envService = envService;
    this.service = service;
    this.commandsRepository = commandsRepository;
    this.commandHandler = commandHandler;
    this.amqpService = amqpService;
  }

  public async onModuleInit() {
    try {
      const jsClient = await this.login();
      this.setupCommandHandler(jsClient);
      await Promise.all([
        this.setupTextChannelListeners(jsClient),
        this.cacheAllMessagesAfterDelimitation(),
        this.setupSlashCommands(),
      ]);

      DiscordClientServiceImpl.logger.log("Logged into Discord");
    } catch (e) {
      DiscordClientServiceImpl.logger.fatal(`Error while logging on Discord: ${e}`);
      throw e;
    }
  }

  public async onModuleDestroy() {
    await (this.client as LoggedDiscordJsClientImpl).client.destroy();
  }

  private async cacheAllMessagesAfterDelimitation(): Promise<void> {
    const messages = await this.service.fetchDelimitationMessagesWithListener();
    await CollectionUtils.asyncForEach(messages, async (message) => {
      const messages = await this.service.fetchChannelMessages({
        channelId: message.channelId,
        guildId: message.guildId,
        after: message.discordMessageId,
        limit: 1500,
      });
      await this.upsertMessagesInDatabase(messages);

      DiscordClientServiceImpl.logger.debug(
        `Cached ${messages.length} ${StringUtils.pluralHandler(messages.length, "message")} for guild ${
          message.guildId
        }`,
      );
    });
  }

  private async upsertMessagesInDatabase(messages: Array<DiscordMessage>): Promise<void> {
    await CollectionUtils.asyncForEach(messages, async (message) => {
      await this.service.saveMessage(message.toDTO());
      await this.amqpService.sendBootstrapMessage(message.toDTO());
    });
  }

  private async setupSlashCommands(): Promise<void> {
    try {
      const guildInfos = await this.service.fetchGuilds();
      DiscordClientServiceImpl.logger.log(
        `Adding ${this.commandsRepository.commands.length} command(s) slash commands to all guilds. Total of ${guildInfos.length} guild(s).`,
      );

      await CollectionUtils.asyncForEach(guildInfos, async (guild) => {
        const guildFetched = await guild.fetch();
        await guildFetched.removeAllCommands();

        await CollectionUtils.asyncForEach(this.commandsRepository.commands, async (command) => {
          await guildFetched.addCommand(command);
        });
      });
    } catch (e) {
      DiscordClientServiceImpl.logger.fatal(e);
      throw e;
    }

    DiscordClientServiceImpl.logger.log("Added slash commands to all guilds.");
  }

  private setupCommandHandler(client: Client<true>): void {
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const chatInteraction = DiscordJsSlashCommandInteractionImpl.fromJsInteraction(interaction);
      await this.commandHandler.handleSlashCommandByInteraction(chatInteraction);
    });
  }

  private async setupTextChannelListeners(client: Client<true>): Promise<void> {
    this.setupMessageCreated(client);
    this.setupMessageDeleted(client);
    this.setupMessageEdited(client);
  }

  private setupMessageCreated(client: Client<true>) {
    client.on("messageCreate", async (message) => {
      const messageParsed = DiscordJsMessageImpl.fromJsFetchedMessage(message as Message<true>);
      await this.textChannelListener.onMessageCreated(messageParsed);
    });
  }

  private setupMessageDeleted(client: Client<true>) {
    client.on("messageDelete", async (message) => {
      const messageParsed = DiscordJsMessageImpl.fromJsMessage(message);
      if (messageParsed) {
        await this.textChannelListener.onMessageDeleted(messageParsed);
      }
    });
  }

  private setupMessageEdited(client: Client<true>) {
    client.on("messageUpdate", async (message) => {
      const messageParsed = DiscordJsMessageImpl.fromJsMessage(message);
      if (messageParsed) {
        await this.textChannelListener.onMessageEdited(messageParsed);
      }
    });
  }

  private async login(): Promise<Client<true>> {
    const client = new DiscordJsClientImpl();

    this._client = await this.networkHandler.login(client, this.envService.discordToken);
    this._textChannelListener = new DiscordJsTextChannelListener(this.service, this.amqpService);

    return await (this._client as LoggedDiscordJsClientImpl).getClientAsTrue();
  }

  public get textChannelListener() {
    return this._textChannelListener;
  }

  public get client() {
    return this._client;
  }
}
