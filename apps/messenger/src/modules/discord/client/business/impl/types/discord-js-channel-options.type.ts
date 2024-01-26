import { Channel } from "discord.js";

export type DiscordJsChannelOptions = {
  readonly createdAt: Date;
  readonly id: string;
  readonly manageable: boolean;
  readonly name: string;
  readonly url: string;
  readonly viewable: boolean;
  readonly channel: Channel;
};
