import { DiscordGuild } from "../client/business/discord-guild";
import { DiscordGuildInfo } from "../client/business/discord-guild-info";
import { DiscordMessage } from "../client/business/discord-message";
import { DiscordTextChannel } from "../client/business/discord-text-channel";
import { GuildFetchOptionsType } from "../client/types/guild-fetch-options.type";
import { MessageFetchOptions } from "../client/types/message-fetch-options.type";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";

export abstract class DiscordService {
  public abstract fetchGuilds(
    options?: GuildFetchOptionsType,
  ): Promise<Array<DiscordGuildInfo>>;
  public abstract fetchGuildById(id: string): Promise<DiscordGuild | undefined>;
  public abstract fetchTextChannels(
    guildId: string,
  ): Promise<Array<DiscordTextChannel>>;
  public abstract fetchTextChannelById(
    guildId: string,
    channelId: string,
  ): Promise<DiscordTextChannel | undefined>;
  public abstract fetchChannelMessages(
    options: MessageFetchOptions,
  ): Promise<Array<DiscordMessage>>;
  public abstract addTextChannelListener(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<void>;
  public abstract listenerExists(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<boolean>;
  public abstract deleteListener(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<void>;
}
