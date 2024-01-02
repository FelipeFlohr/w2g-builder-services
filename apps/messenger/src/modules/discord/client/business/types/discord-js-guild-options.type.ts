import { Guild } from "discord.js";

export type DiscordJsGuildOptions = {
  readonly applicationId?: string;
  readonly memberCount: number;
  readonly avaiable: boolean;
  readonly createdAt: Date;
  readonly id: string;
  readonly joinedAt: Date;
  readonly ownerId: string;
  readonly name: string;
  readonly large: boolean;
  readonly guild: Guild;
};
