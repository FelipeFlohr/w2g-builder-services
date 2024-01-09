import { DiscordGuild } from "../client/business/discord-guild";
import { DiscordGuildInfo } from "../client/business/discord-guild-info";
import { DiscordMessage } from "../client/business/discord-message";
import { DiscordTextChannel } from "../client/business/discord-text-channel";
import { GuildFetchOptionsType } from "../client/types/guild-fetch-options.type";
import { MessageFetchOptions } from "../client/types/message-fetch-options.type";

export interface DiscordService {
  fetchGuilds(
    options?: GuildFetchOptionsType,
  ): Promise<Array<DiscordGuildInfo>>;
  fetchGuildById(id: string): Promise<DiscordGuild | undefined>;
  fetchTextChannels(guildId: string): Promise<Array<DiscordTextChannel>>;
  fetchTextChannelById(
    guildId: string,
    channelId: string,
  ): Promise<DiscordTextChannel | undefined>;
  fetchChannelMessages(
    options: MessageFetchOptions,
  ): Promise<Array<DiscordMessage>>;
}

export const DiscordService = Symbol("DiscordService");
