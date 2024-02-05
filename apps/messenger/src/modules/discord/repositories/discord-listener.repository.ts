import { DiscordListenerEntity } from "../entities/discord-listener.entity";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";

export interface DiscordListenerRepository {
  saveListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  deleteListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  findListenerByDTO(listener: DiscordTextChannelListenerDTO): Promise<DiscordListenerEntity | undefined>;
  findAllListeners(): Promise<Array<DiscordListenerEntity>>;
}

export const DiscordListenerRepository = Symbol("DiscordListenerRepository");
