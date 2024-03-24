import { DiscordDelimitationMessageDTO } from "src/models/discord-demilitation-message.dto";
import { MessengerBaseEntity } from "src/modules/database/base/messenger-base.entity";
import { DiscordMessageEntity } from "./discord-message.entity";

export interface DiscordDelimitationMessageEntity extends MessengerBaseEntity<DiscordDelimitationMessageEntity> {
  id: number;
  message: DiscordMessageEntity;
  messageId: number;
  toDTO(): DiscordDelimitationMessageDTO;
}
