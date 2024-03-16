import { MessengerBaseRepository } from "src/modules/database/base/messenger-base.repository";
import { DiscordDelimitationMessageEntity } from "../entities/discord-delimitation-message.entity";

export interface DiscordDelimitationMessageRepository
  extends MessengerBaseRepository<DiscordDelimitationMessageEntity> {}
