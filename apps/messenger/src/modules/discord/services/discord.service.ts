import { GuildFetchOptionsType } from "../client/types/guild-fetch-options.type";
import { DiscordGuildInfoDTO } from "../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../models/discord-guild.dto";
import { DiscordTextChannelDTO } from "../models/discord-text-channel.dto";

export interface DiscordService {
  fetchGuilds(
    options?: GuildFetchOptionsType,
  ): Promise<Array<DiscordGuildInfoDTO>>;
  fetchGuildById(id: string): Promise<DiscordGuildDTO | undefined>;
  fetchTextChannels(guildId: string): Promise<Array<DiscordTextChannelDTO>>;
  fetchTextChannelById(
    guildId: string,
    channelId: string,
  ): Promise<DiscordTextChannelDTO | undefined>;
}

export const DiscordService = Symbol("DiscordService");
