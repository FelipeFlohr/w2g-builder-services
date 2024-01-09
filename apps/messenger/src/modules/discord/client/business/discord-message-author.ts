import { DiscordMessageAuthorDTO } from "../../models/discord-message-author.dto";

export interface DiscordMessageAuthor {
  readonly avatarPngUrl?: string;
  readonly bannerPngUrl?: string;
  readonly bot: boolean;
  readonly createdAt: Date;
  readonly discriminator: string;
  readonly displayName: string;
  readonly globalName?: string;
  readonly id: string;
  readonly tag: string;
  readonly system: boolean;
  readonly username: string;
  toDTO(): DiscordMessageAuthorDTO;
}
