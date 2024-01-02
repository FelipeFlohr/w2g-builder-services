import { GuildFetchOptionsType } from "../client/types/guild-fetch-options.type";
import { DiscordGuildInfoDTO } from "../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../models/discord-guild.dto";

export interface DiscordService {
  fetchGuilds(
    options?: GuildFetchOptionsType,
  ): Promise<Array<DiscordGuildInfoDTO>>;
  fetchGuildById(id: string): Promise<DiscordGuildDTO | undefined>;
}

export const DiscordService = Symbol("DiscordService");
