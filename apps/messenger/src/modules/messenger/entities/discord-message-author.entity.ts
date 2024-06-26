import { DiscordMessageAuthorDTO } from "src/models/discord-message-author.dto";
import { MessengerBaseEntity } from "src/modules/database/base/messenger-base.entity";
import { DiscordMessageEntity } from "./discord-message.entity";

export interface DiscordMessageAuthorEntity extends MessengerBaseEntity<DiscordMessageAuthorEntity> {
  id: number;
  avatarPngUrl?: string;
  bannerPngUrl?: string;
  bot: boolean;
  authorCreatedAt: Date;
  discriminator: string;
  displayName: string;
  globalName?: string;
  authorId: string;
  tag: string;
  system: boolean;
  username: string;
  message: DiscordMessageEntity;
  toDTO(): DiscordMessageAuthorDTO;
}
