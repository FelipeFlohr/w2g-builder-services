import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { DiscordService } from "../discord.service";
import { DiscordGuildInfoDTO } from "../../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../../models/discord-guild.dto";
import { GuildFetchOptionsType } from "../../types/guild-fetch-options.type";
import { Client, DiscordAPIError, Events, Guild, Message, NonThreadGuildBasedChannel, TextChannel } from "discord.js";
import { EnvironmentSettingsServiceProvider } from "src/modules/env/providers/environment-settings-service.provider";
import { EnvironmentSettingsService } from "src/modules/env/services/environment-settings.service";
import { DiscordJsHelper } from "./discord-js.helper";
import { LoggerUtils } from "src/utils/logger.utils";
import { CollectionUtils } from "src/utils/collection.utils";
import { DiscordErrorCodeEnum } from "../../enums/discord-error-code.enum";
import { DiscordChannelDTO } from "../../models/discord-channel.dto";
import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { MessageFetchOptionsType } from "../../types/message-fetch-options.type";
import { DiscordSlashCommandDTO } from "../../models/discord-slash-command.dto";

@Injectable()
export class DiscordServiceImpl implements DiscordService, OnModuleInit {
  private readonly env: EnvironmentSettingsService;
  private readonly helper = new DiscordJsHelper();
  private readonly logger = LoggerUtils.from(DiscordServiceImpl);
  private client: Client<true>;

  private static readonly MAX_GUILD_FETCH = 200;
  private static readonly MAX_MESSAGES_TO_FETCH = 100;

  public constructor(@Inject(EnvironmentSettingsServiceProvider) env: EnvironmentSettingsService) {
    this.env = env;
  }

  public async onModuleInit() {
    await this.login();
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
          return messages.map(this.helper.discordJsMessageToMessageDTO);
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
}
