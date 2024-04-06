import { GuildInfoType } from "../types/guild-info.type";

export class GuildInfoDTO {
  public readonly name: string;
  public readonly guildId: string;
  public readonly url: string;

  public constructor(info: GuildInfoType) {
    this.name = info.name;
    this.guildId = info.guildId;
    this.url = info.url;
  }
}
