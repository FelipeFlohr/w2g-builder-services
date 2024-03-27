export class GuildWithImageLinkDTO {
  public readonly name: string;
  public readonly guildId: string;
  public readonly url: string;

  public constructor(name: string, guildId: string, url: string) {
    this.name = name;
    this.guildId = guildId;
    this.url = url;
  }
}
