import { MessengerBaseRepository } from "src/modules/database/base/messenger-base.repository";
import { DiscordListenerEntity } from "../entities/discord-listener.entity";

export interface DiscordListenerRepository extends MessengerBaseRepository<DiscordListenerEntity> {
  existsByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean>;
  getByChannelIdAndGuildId(channelId: string, guildId: string): Promise<DiscordListenerEntity | undefined>;
  saveListenerAndFlush(channelId: string, guildId: string): Promise<DiscordListenerEntity>;
  getAllListeners(): Promise<Array<DiscordListenerEntity>>;
  deleteListenerByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean>;
}
