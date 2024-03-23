import { DiscordChannelDTOOptionsType } from "../types/discord-channel-dto-options.type";

export class DiscordChannelDTO {
  public readonly createdAt: Date;
  public readonly id: string;
  public readonly manageable: boolean;
  public readonly name: string;
  public readonly url: string;
  public readonly viewable: boolean;

  public constructor(options: DiscordChannelDTOOptionsType) {
    this.createdAt = this.createdAt;
    this.id = options.id;
    this.manageable = options.manageable;
    this.name = options.name;
    this.url = options.url;
    this.viewable = options.viewable;
  }
}
