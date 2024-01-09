import { DiscordMessageAuthorDTOOptions } from "../types/discord-message-author-dto-options.type";

export class DiscordMessageAuthorDTO {
  public readonly avatarPngUrl?: string;
  public readonly bannerPngUrl?: string;
  public readonly bot: boolean;
  public readonly createdAt: Date;
  public readonly discriminator: string;
  public readonly displayName: string;
  public readonly globalName?: string;
  public readonly id: string;
  public readonly tag: string;
  public readonly system: boolean;
  public readonly username: string;

  public constructor(options: DiscordMessageAuthorDTOOptions) {
    this.avatarPngUrl = options.avatarPngUrl;
    this.bannerPngUrl = options.bannerPngUrl;
    this.bot = options.bot;
    this.createdAt = options.createdAt;
    this.discriminator = options.discriminator;
    this.displayName = options.displayName;
    this.globalName = options.globalName;
    this.id = options.id;
    this.tag = options.tag;
    this.system = options.system;
    this.username = options.username;
  }
}
