export class DiscordTextChannelListenerDTO {
  public readonly guildId: string;
  public readonly channelId: string;

  public constructor(guildId: string, channelId: string) {
    this.guildId = guildId;
    this.channelId = channelId;
  }
}
