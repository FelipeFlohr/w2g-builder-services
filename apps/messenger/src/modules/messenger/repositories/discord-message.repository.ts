import { MessengerBaseRepository } from "src/modules/database/base/messenger-base.repository";
import { DiscordMessageEntity } from "../entities/discord-message.entity";

export interface DiscordMessageRepository extends MessengerBaseRepository<DiscordMessageEntity> {
  deleteManyByChannelIdAndGuildId(channelId: string, guildId: string): Promise<number>;
}
