import { DiscordGuildInfoDTOOptions } from "../types/discord-guild-info-dto-options.type";

export class DiscordGuildInfoDTO {
  public readonly id: string;
  public readonly verified: boolean;
  public readonly createdAt: Date;
  public readonly iconPngUrl?: string;
  public readonly iconJpegUrl?: string;
  public readonly iconGifUrl?: string;

  public constructor(options: DiscordGuildInfoDTOOptions) {
    this.id = options.id;
    this.verified = options.verified;
    this.createdAt = options.createdAt;
    this.iconPngUrl = options.iconPngUrl;
    this.iconJpegUrl = options.iconJpegUrl;
    this.iconGifUrl = options.iconGifUrl;
  }
}
