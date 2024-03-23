import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import {
  Client,
  DiscordAPIError,
  Events,
  Guild,
  Message,
  NonThreadGuildBasedChannel,
  PartialMessage,
  TextChannel,
} from "discord.js";
import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { EnvironmentSettingsServiceProvider } from "src/modules/env/providers/environment-settings-service.provider";
import { EnvironmentSettingsService } from "src/modules/env/services/environment-settings.service";
import { CollectionUtils } from "src/utils/collection.utils";
import { LoggerUtils } from "src/utils/logger.utils";
import { DiscordCommandError } from "../../base/discord-command.error";
import { DiscordErrorCodeEnum } from "../../enums/discord-error-code.enum";
import { IMessageListener } from "../../interfaces/message-listener.interface";
import { DiscordChannelDTO } from "../../models/discord-channel.dto";
import { DiscordGuildInfoDTO } from "../../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../../models/discord-guild.dto";
import { DiscordSlashCommandDTO } from "../../models/discord-slash-command.dto";
import { GuildFetchOptionsType } from "../../types/guild-fetch-options.type";
import { MessageFetchOptionsType } from "../../types/message-fetch-options.type";
import { DiscordService } from "../discord.service";
import { DiscordJsHelper } from "./discord-js.helper";

@Injectable()
export class DiscordServiceImpl implements DiscordService, OnModuleInit {
  private readonly env: EnvironmentSettingsService;
  private readonly helper = new DiscordJsHelper();
  private readonly logger = LoggerUtils.from(DiscordServiceImpl);
  private readonly slashCommands: Array<DiscordSlashCommandDTO> = [];
  private client: Client<true>;

  private static readonly MAX_GUILD_FETCH = 200;
  private static readonly MAX_MESSAGES_TO_FETCH = 100;

  public constructor(@Inject(EnvironmentSettingsServiceProvider) env: EnvironmentSettingsService) {
    this.env = env;
  }

  public async onModuleInit() {
    await this.login();
    this.setupInteractionListeners();
  }

  public async fetchGuilds(options?: GuildFetchOptionsType | undefined): Promise<DiscordGuildInfoDTO[]> {
    return await CollectionUtils.fetchCollection(
      {
        maxPossibleRecordsToFetch: DiscordServiceImpl.MAX_GUILD_FETCH,
        maxRecords: options?.limit,
      },
      async (amount, lastItemFetched) => {
        const res = await this.client.guilds.fetch({
          after: options?.after,
          before: options?.before ?? lastItemFetched?.id,
          limit: amount,
        });
        return res.map(this.helper.OAuth2GuildToGuildInfoDTO);
      },
    );
  }

  public async fetchGuildById(id: string): Promise<DiscordGuildDTO | undefined> {
    const guild = await this.fetchGuild(id);
    if (guild) {
      return this.helper.guildToGuildDTO(guild);
    }
  }

  public async fetchGuildByGuildInfo(guildInfo: DiscordGuildInfoDTO): Promise<DiscordGuildDTO | undefined> {
    return await this.fetchGuildById(guildInfo.id);
  }

  public async fetchChannelsByGuildId(guildId: string): Promise<DiscordChannelDTO[]> {
    const guild = await this.client.guilds.fetch(guildId);
    const channels = await guild.channels.fetch();
    return channels
      .filter((channel) => channel != null)
      .map((channel) => channel as NonThreadGuildBasedChannel)
      .map(this.helper.discordJsChannelToChannelDTO);
  }

  public async fetchChannelsByGuild(guild: DiscordGuildDTO): Promise<DiscordChannelDTO[]> {
    return await this.fetchChannelsByGuildId(guild.id);
  }

  public async fetchChannelByIdAndGuildId(channelId: string, guildId: string): Promise<DiscordChannelDTO | undefined> {
    const channel = await this.fetchChannel(channelId, guildId);
    if (channel) {
      return this.helper.discordJsChannelToChannelDTO(channel);
    }
  }

  public async fetchMessages(options: MessageFetchOptionsType): Promise<DiscordMessageDTO[]> {
    const guildId = typeof options.guild === "string" ? options.guild : options.guild.id;
    const channelId = typeof options.channel === "string" ? options.channel : options.channel.id;
    const guild = await this.client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(channelId);

    if (channel instanceof TextChannel) {
      return await CollectionUtils.fetchCollection<DiscordMessageDTO>(
        {
          maxPossibleRecordsToFetch: DiscordServiceImpl.MAX_MESSAGES_TO_FETCH,
          maxRecords: options.limit,
        },
        async (amount, lastItem) => {
          const messages = await channel.messages.fetch({
            after: lastItem == undefined ? options.after : lastItem.id,
            around: options.around,
            before: options.before,
            cache: true,
            limit: amount,
          });
          return messages.map((value) => this.helper.discordJsMessageToMessageDTO(value));
        },
      );
    }
    return [];
  }

  public async fetchMessageByIdAndGuildIdAndChannelId(
    messageId: string,
    channelId: string,
    guildId: string,
  ): Promise<DiscordMessageDTO | undefined> {
    const message = await this.fetchMessage(messageId, channelId, guildId);
    if (message) {
      return this.helper.discordJsMessageToMessageDTO(message);
    }
  }

  public async addSlashCommandToAllGuilds(command: DiscordSlashCommandDTO): Promise<void> {
    const guildInfos = await this.fetchGuilds();
    const guildIds = guildInfos.map((g) => g.id);
    await CollectionUtils.asyncForEach(guildIds, async (guildId) => {
      const guild = await this.fetchGuild(guildId);
      if (guild) {
        await guild.commands.create(this.helper.slashCommandDTOToSlashCommandBuilder(command));
      }
    });
    this.logger.log(`Created global command "${command.name}".`);
  }

  public addSlashCommandToInteraction(command: DiscordSlashCommandDTO): void {
    this.slashCommands.push(command);
  }

  public async deleteAllSlashCommandsFromAllGuilds(): Promise<void> {
    const guildInfos = await this.fetchGuilds();
    const guildIds = guildInfos.map((g) => g.id);
    await CollectionUtils.asyncForEach(guildIds, async (guildId) => {
      const guild = await this.fetchGuild(guildId);
      if (guild) {
        await guild.commands.set([]);
      }
    });
  }

  public addMessageCreatedListener(listener: IMessageListener): void {
    this.client.on(Events.MessageCreate, async (message) => this.onMessageWrapper(listener, message));
  }

  public addMessageUpdatedListener(listener: IMessageListener): void {
    this.client.on(Events.MessageUpdate, async (message) => this.onMessageWrapper(listener, message));
  }

  addMessageDeletedListener(listener: IMessageListener): void {
    this.client.on(Events.MessageDelete, async (message) => this.onMessageWrapper(listener, message));
  }

  private async login(): Promise<void> {
    const clientIsNotReady = this.client == null || !this.client.isReady();
    if (clientIsNotReady) {
      const clientLoggedOff = this.helper.createClient();
      clientLoggedOff.login(this.env.discordToken);

      this.client = await this.waitForLogin(clientLoggedOff);
      this.logger.log("Discord client logged in.");
    }
  }

  private async waitForLogin(client: Client<false>): Promise<Client<true>> {
    return new Promise((res) => client.once(Events.ClientReady, res));
  }

  private async fetchGuild(guildId: string): Promise<Guild | undefined> {
    try {
      return await this.client.guilds.fetch(guildId);
    } catch (e) {
      if (e instanceof DiscordAPIError && e.code === DiscordErrorCodeEnum.UNKNOWN_GUILD) {
        return;
      }
      throw e;
    }
  }

  private async fetchChannel(channelId: string, guildId: string): Promise<TextChannel | undefined> {
    try {
      const guild = await this.fetchGuild(guildId);
      if (guild) {
        const channel = await guild.channels.fetch(channelId);
        if (channel instanceof TextChannel) return channel;
      }
    } catch (e) {
      if (e instanceof DiscordAPIError && e.code === DiscordErrorCodeEnum.UNKNOWN_CHANNEL) {
        return;
      }
      throw e;
    }
  }

  private async fetchMessage(
    messageId: string,
    channelId: string,
    guildId: string,
  ): Promise<Message<true> | undefined> {
    try {
      const channel = await this.fetchChannel(channelId, guildId);
      return await channel?.messages.fetch(messageId);
    } catch (e) {
      if (e instanceof DiscordAPIError && e.code === DiscordErrorCodeEnum.UNKNOWN_MESSAGE) {
        return;
      }
      throw e;
    }
  }

  private setupInteractionListeners(): void {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        try {
          const command = this.slashCommands.find((c) => c.name === interaction.commandName);
          const res = await command?.onInteraction(this.helper.commandInteractionToInteractionDTO(interaction));
          if (res) await interaction.reply(res);
        } catch (e) {
          if (e instanceof DiscordAPIError && e.code === DiscordErrorCodeEnum.UNKNOWN_INTERACTION) {
            this.logger.error(e);
            return;
          } else if (e instanceof DiscordCommandError) {
            await interaction.reply(e.message);
          } else {
            throw e;
          }
        }
      }
    });
  }

  private async onMessageWrapper(
    listener: IMessageListener,
    message: Message<boolean> | PartialMessage,
  ): Promise<void> {
    const nonFetchedMessage = this.helper.discordJsMessageToMessageDTO(message);
    if (nonFetchedMessage && (await listener.validateBeforeFetching(nonFetchedMessage))) {
      const messageFetched = await this.helper.fetchMessageIfNotFetched(message);
      const messageDTO = this.helper.discordJsMessageToMessageDTO(messageFetched);
      if (messageDTO) {
        await listener.onMessage(messageDTO);
      }
    }
  }
}
