import { DiscordChannelDTO } from "../../models/discord-channel.dto";

export interface DiscordChannel {
  readonly createdAt: Date;
  readonly id: string;
  readonly manageable: boolean;
  readonly name: string;
  readonly url: string;
  readonly viewable: boolean;
  isTextChannel(): boolean;
  toDTO(): DiscordChannelDTO;
}
