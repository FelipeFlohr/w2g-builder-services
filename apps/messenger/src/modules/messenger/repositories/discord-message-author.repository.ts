import { MessengerBaseRepository } from "src/modules/database/base/messenger-base.repository";
import { DiscordMessageAuthorEntity } from "../entities/discord-message-author.entity";

export interface DiscordMessageAuthorRepository extends MessengerBaseRepository<DiscordMessageAuthorEntity> {}
