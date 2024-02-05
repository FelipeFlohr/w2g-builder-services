import { DiscordGuild } from "./business/discord-guild";
import { DiscordGuildInfo } from "./business/discord-guild-info";
import { DiscordClient } from "./discord-client";
import { GuildFetchOptionsType } from "./types/guild-fetch-options.type";

export interface LoggedDiscordClient extends DiscordClient {
  fetchGuilds(options?: GuildFetchOptionsType): Promise<Array<DiscordGuildInfo>>;
  fetchGuildById(id: string): Promise<DiscordGuild | undefined>;
}
