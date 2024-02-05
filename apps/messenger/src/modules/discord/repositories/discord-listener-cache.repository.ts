import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";

export interface DiscordListenerCacheRepository {
  saveListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  deleteListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  findListenerByDTO(listener: DiscordTextChannelListenerDTO): Promise<DiscordTextChannelListenerDTO | undefined>;
  findAllListeners(): Promise<Array<DiscordTextChannelListenerDTO>>;
}

export const DiscordListenerCacheRepository = Symbol("DiscordListenerCacheRepository");
