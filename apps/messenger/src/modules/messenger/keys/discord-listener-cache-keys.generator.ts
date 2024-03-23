export class DiscordListenerCacheKeysGenerator {
  private static readonly LISTENER_PREFIX = "DISCORD_LISTENER";
  private static readonly ID_PREFIX = "ID:{0}";
  private static readonly CHANNEL_ID_PREFIX = "CHANNEL_ID:{1}";
  private static readonly GUILD_ID_PREFIX = "GUILD_ID:{2}";
  private static readonly LISTENER_KEY = `${this.LISTENER_PREFIX}|${this.ID_PREFIX}|${this.CHANNEL_ID_PREFIX}|${this.GUILD_ID_PREFIX}`;

  public static generateListenerKey(id: number, channelId: string, guildId: string): string {
    return this.LISTENER_KEY.replace("{0}", id.toString()).replace("{1}", channelId).replace("{2}", guildId);
  }

  public static getKeyFinderById(id: number): string {
    return `${this.LISTENER_KEY}|${this.ID_PREFIX.replace("{0}", id.toString())}|*`;
  }

  public static getKeyFinderByChannelIdAndGuildId(channelId: string, guildId: string): string {
    const channelPrefix = this.CHANNEL_ID_PREFIX.replace("{0}", channelId);
    const guildPrefix = this.GUILD_ID_PREFIX.replace("{1}", guildId);
    return `${this.LISTENER_KEY}|*|${channelPrefix}|${guildPrefix}`;
  }

  public static getKeyFinderAllKeys(): string {
    const idPrefix = this.ID_PREFIX.replace("{0}", "*");
    const channelIdPrefix = this.CHANNEL_ID_PREFIX.replace("{1}", "*");
    const guildIdPrefix = this.GUILD_ID_PREFIX.replace("{2}", "*");
    return `${this.LISTENER_PREFIX}|${idPrefix}|${channelIdPrefix}|${guildIdPrefix}`;
  }
}
