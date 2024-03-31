export class GuildWithChannelIdsDTO {
  public readonly guildId: string;
  public readonly channelIds: Array<string>;

  public constructor(guildId: string, channelIds: Array<string>) {
    this.guildId = guildId;
    this.channelIds = channelIds;
  }
}
