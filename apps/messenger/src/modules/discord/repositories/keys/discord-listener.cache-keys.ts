import { DiscordTextChannelListenerDTO } from "../../models/discord-text-channel-listener.dto";

export class DiscordListenerCacheKeys {
  public static readonly ALL_LISTENERS_KEY = "DISCORD_LISTENER|GUILD_ID:*|CHANNEL_ID:*";

  public static getListenerKey(listener: DiscordTextChannelListenerDTO): string {
    return `DISCORD_LISTENER|GUILD_ID:${listener.guildId}|CHANNEL_ID:${listener.channelId}`;
  }
}
