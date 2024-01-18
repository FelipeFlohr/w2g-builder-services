import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  forwardRef,
} from "@nestjs/common";
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

@Injectable()
export class DiscordClientImplService
  implements DiscordClientService, OnModuleInit, OnModuleDestroy
{
  private readonly networkHandler: DiscordNetworkHandler;
  private readonly envService: EnvironmentSettingsService;
  private readonly service: DiscordService;
  private readonly commandsRepository: DiscordCommandRepository;
  private _textChannelListener: DiscordTextChannelListener;
  private _client: LoggedDiscordClient;

  private static readonly logger: Logger = new Logger(
    DiscordClientImplService.name,
  );

  public constructor(
    @Inject(DiscordNetworkHandler) networkHandler: DiscordNetworkHandler,
    @Inject(EnvironmentSettingsService) envService: EnvironmentSettingsService,
    @Inject(forwardRef(() => DiscordService)) service: DiscordService,
    @Inject(DiscordCommandRepository)
    commandsRepository: DiscordCommandRepository,
  ) {
    this.networkHandler = networkHandler;
    this.envService = envService;
    this.service = service;
    this.commandsRepository = commandsRepository;
  }

  public async onModuleInit() {
    try {
      const client = new DiscordJsClientImpl();

      this._client = await this.networkHandler.login(
        client,
        this.envService.discordToken,
      );
      this._textChannelListener = new DiscordJsTextChannelListener(
        this.service,
      );
      await this.setupTextChannelListeners();
      DiscordClientImplService.logger.log("Logged into Discord");
    } catch (e) {
      DiscordClientImplService.logger.fatal(
        `Error while logging on Discord: ${e}`,
      );
      throw e;
    }
  }

  public async onModuleDestroy() {
    await (this.client as LoggedDiscordJsClientImpl).client.destroy();
  }

  private async setupSlashCommands(): Promise<void> {
    const guildInfos = await this.service.fetchGuilds();
    const guildCommandFuncs = guildInfos.map(async (guild) => {
      const guildFetched = await guild.fetch();
      const addCommandFuncs = this.commandsRepository.commands
        .map(async command => c)
    });
  }

  private async setupTextChannelListeners(): Promise<void> {
    const client = await (
      this.client as LoggedDiscordJsClientImpl
    ).getClientAsTrue();

    this.setupMessageCreated(client);
    this.setupMessageDeleted(client);
    this.setupMessageEdited(client);
  }

  private setupMessageCreated(client: Client<true>) {
    client.on("messageCreate", async (message) => {
      const messageParsed = DiscordJsMessageImpl.fromJsFetchedMessage(
        message as Message<true>,
      );
      this.textChannelListener.onMessageCreated(messageParsed);
    });
  }

  private setupMessageDeleted(client: Client<true>) {
    client.on("messageDelete", async (message) => {
      const messageParsed = DiscordJsMessageImpl.fromJsMessage(message);
      if (messageParsed) {
        this.textChannelListener.onMessageDeleted(messageParsed);
      }
    });
  }

  private setupMessageEdited(client: Client<true>) {
    client.on("messageUpdate", async (message) => {
      const messageParsed = DiscordJsMessageImpl.fromJsMessage(message);
      if (messageParsed) {
        this.textChannelListener.onMessageDeleted(messageParsed);
      }
    });
  }

  public get textChannelListener() {
    return this._textChannelListener;
  }

  public get client() {
    return this._client;
  }
}
