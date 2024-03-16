import { MessengerBaseRepository } from "src/modules/database/base/messenger-base.repository";
import { DiscordListenerEntity } from "../entities/discord-listener.entity";

export interface DiscordListenerRepository extends MessengerBaseRepository<DiscordListenerEntity> {}
