import { OAuth2Guild } from "discord.js";

export type DiscordJsGuildInfoOptionsType = {
  readonly id: string;
  readonly verified: boolean;
  readonly createdAt: Date;
  readonly iconPngUrl?: string;
  readonly iconJpegUrl?: string;
  readonly iconGifUrl?: string;
  readonly authGuild: OAuth2Guild;
};
