import { MessengerBaseRepository } from "src/modules/database/base/messenger-base.repository";
import { DiscordDelimitationMessageEntity } from "../entities/discord-delimitation-message.entity";
import { DiscordDelimitationMessageDTO } from "src/models/discord-demilitation-message.dto";

export interface DiscordDelimitationMessageRepository
  extends MessengerBaseRepository<DiscordDelimitationMessageEntity> {
  getByChannelIdAndGuildId(channelId: string, guildId: string): Promise<DiscordDelimitationMessageEntity | undefined>;
  deleteByGuildIdAndChannelId(channelId: string, guildId: string): Promise<boolean>;
  existsByMessageIdAndChannelIdAndGuildId(messageId: string, channelId: string, guildId: string): Promise<boolean>;
  save(delimitation: DiscordDelimitationMessageDTO): Promise<DiscordDelimitationMessageEntity>;
  getMessageUrlByChannelIdAndGuildId(channelId: string, guildId: string): Promise<string | undefined>;
}
