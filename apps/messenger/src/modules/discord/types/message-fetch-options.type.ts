import { DiscordChannelDTO } from "../models/discord-channel.dto";
import { DiscordGuildDTO } from "../models/discord-guild.dto";

export type MessageFetchOptionsType = {
  readonly after?: string;
  readonly around?: string;
  readonly before?: string;
  readonly limit?: number;
  readonly guild: string | DiscordGuildDTO;
  readonly channel: string | DiscordChannelDTO;
};
