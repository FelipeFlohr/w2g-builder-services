import { DiscordGuild } from "../client/business/discord-guild";
import { DiscordGuildInfo } from "../client/business/discord-guild-info";
import { DiscordMessage } from "../client/business/discord-message";
import { DiscordTextChannel } from "../client/business/discord-text-channel";
import { GuildFetchOptionsType } from "../client/types/guild-fetch-options.type";
import { MessageFetchOptions } from "../client/types/message-fetch-options.type";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";

export interface DiscordService {
  fetchGuilds(
    options?: GuildFetchOptionsType,
  ): Promise<Array<DiscordGuildInfo>>;
  fetchGuildById(id: string): Promise<DiscordGuild | undefined>;
  fetchTextChannels(guildId: string): Promise<Array<DiscordTextChannel>>;
  fetchTextChannelById(
    guildId: string,
    channelId: string,
  ): Promise<DiscordTextChannel | undefined>;
  fetchChannelMessages(
    options: MessageFetchOptions,
  ): Promise<Array<DiscordMessage>>;
  fetchMessageById(
    guildId: string,
    channelId: string,
    messageId: string,
  ): Promise<DiscordMessage | undefined>;
  addTextChannelListener(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<void>;
  listenerExists(listener: DiscordTextChannelListenerDTO): Promise<boolean>;
  deleteListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  createDelimitationMessage(message: DiscordMessage): Promise<void>;
}

export const DiscordService = Symbol("DiscordService");
