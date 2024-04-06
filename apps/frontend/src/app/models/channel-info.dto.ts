import { ChannelInfoType } from "../types/channel-info.type";

export class ChannelInfoDTO {
  public readonly id: string;
  public readonly name: string;

  public constructor(info: ChannelInfoType) {
    this.id = info.id;
    this.name = info.name;
  }
}
