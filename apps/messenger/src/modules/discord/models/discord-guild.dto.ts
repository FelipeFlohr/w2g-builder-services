import { DiscordGuildDTOOptionsType } from "../types/discord-guild-dto-options.type";

export class DiscordGuildDTO {
  public readonly applicationId?: string;
  public readonly memberCount: number;
  public readonly available: boolean;
  public readonly createdAt: Date;
  public readonly id: string;
  public readonly joinedAt: Date;
  public readonly ownerId: string;
  public readonly name: string;
  public readonly large: boolean;
  public readonly iconPngUrl?: string;
  public readonly iconJpegUrl?: string;
  public readonly iconGifUrl?: string;

  public constructor(options: DiscordGuildDTOOptionsType) {
    this.applicationId = options.applicationId;
    this.memberCount = options.memberCount;
    this.available = options.available;
    this.createdAt = options.createdAt;
    this.id = options.id;
    this.joinedAt = options.joinedAt;
    this.ownerId = options.ownerId;
    this.name = options.name;
    this.large = options.large;
    this.iconPngUrl = options.iconPngUrl;
    this.iconJpegUrl = options.iconJpegUrl;
    this.iconGifUrl = options.iconGifUrl;
  }
}
