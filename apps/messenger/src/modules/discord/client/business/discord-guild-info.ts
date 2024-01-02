import { DiscordGuildInfoDTO } from "../../models/discord-guild-info.dto";
import { DiscordGuild } from "./discord-guild";

export interface DiscordGuildInfo {
  readonly id: string;
  readonly verified: boolean;
  readonly createdAt: Date;
  readonly iconPngUrl?: string;
  readonly iconJpegUrl?: string;
  readonly iconGifUrl?: string;
  fetch(): Promise<DiscordGuild>;
  toDTO(): DiscordGuildInfoDTO;
}
