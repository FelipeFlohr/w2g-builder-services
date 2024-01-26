import { DiscordListenerEntity } from "../entities/discord-listener.entity";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";

export interface DiscordListenerRepository {
  saveListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  deleteListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  findListenerByDTO(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<DiscordListenerEntity | undefined>;
}

export const DiscordListenerRepository = Symbol("DiscordListenerRepository");
export const DiscordListenerCacheRepository = Symbol(
  "DiscordListenerCacheRepository",
);
