import { DiscordChannel } from "./discord-channel";

export interface DiscordTextChannel extends DiscordChannel {
  readonly lastMessageId?: string;
  readonly parentId?: string;
  readonly rateLimitPerUser?: number;
}
