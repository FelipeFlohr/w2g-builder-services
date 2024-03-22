import { MessengerBaseRepository } from "src/modules/database/base/messenger-base.repository";
import { DiscordMessageEntity } from "../entities/discord-message.entity";
import { DiscordMessageDTO } from "src/models/discord-message.dto";

export interface DiscordMessageRepository extends MessengerBaseRepository<DiscordMessageEntity> {
  deleteManyByChannelIdAndGuildId(channelId: string, guildId: string): Promise<number>;
  deleteByMessageIdAndChannelIdAndGuildId(messageId: string, channelId: string, guildId: string): Promise<boolean>;
  upsert(message: DiscordMessageDTO): Promise<DiscordMessageEntity>;
  upsertMany(messages: Array<DiscordMessageDTO>): Promise<void>;
  existsByMessageIdAndChannelIdAndGuildId(messageId: string, channelId: string, guildId: string): Promise<boolean>;
  getUrlById(id: number): Promise<string | undefined>;
}
