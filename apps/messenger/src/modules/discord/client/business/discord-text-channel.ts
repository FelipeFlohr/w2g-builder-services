import { DiscordTextChannelDTO } from "../../models/discord-text-channel.dto";
import { DiscordChannel } from "./discord-channel";
import { DiscordParentCategory } from "./discord-parent-category";

export interface DiscordTextChannel extends DiscordChannel {
  readonly lastMessageId?: string;
  readonly parent?: DiscordParentCategory;
  readonly rateLimitPerUser?: number;
  toDTO(): DiscordTextChannelDTO;
}
