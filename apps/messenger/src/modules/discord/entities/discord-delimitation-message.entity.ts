import { MessengerBaseEntity } from "src/database/base/messenger-base.entity";
import { DiscordMessageEntity } from "./discord-message.entity";

export interface DiscordDelimitationMessageEntity extends MessengerBaseEntity {
  id: number;
  message: DiscordMessageEntity;
}
