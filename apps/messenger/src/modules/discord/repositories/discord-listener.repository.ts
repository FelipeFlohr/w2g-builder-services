import { DiscordListenerEntity } from "../entities/discord-listener.entity";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";

export interface DiscordListenerRepository {
  saveListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  deleteListener(guildId: string, channelId: string): Promise<void>;
  findListenerByGuildAndChannelId(
    guildId: string,
    channelId: string,
  ): Promise<DiscordListenerEntity | undefined>;
}

export const DiscordListenerRepository = Symbol("DiscordListenerRepository");
