import { MessengerBaseEntity } from "src/modules/database/base/messenger-base.entity";
import { DiscordDelimitationMessageEntity } from "./discord-delimitation-message.entity";
import { DiscordMessageAuthorEntity } from "./discord-message-author.entity";

export interface DiscordMessageEntity extends MessengerBaseEntity<DiscordMessageEntity> {
  id: number;
  applicationId?: string;
  author: DiscordMessageAuthorEntity;
  cleanContent: string;
  content: string;
  hasThread: boolean;
  messageId: string;
  pinnable: boolean;
  pinned: boolean;
  position?: number;
  system: boolean;
  url: string;
  guildId: string;
  channelId: string;
  delimitation?: DiscordDelimitationMessageEntity;
  messageCreatedAt: Date;
}
