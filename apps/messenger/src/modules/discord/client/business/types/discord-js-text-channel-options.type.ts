import { DiscordJsChannelOptions } from "./discord-js-channel-options.type";

export type DiscordJsTextChannelOptions = DiscordJsChannelOptions & {
  readonly lastMessageId?: string;
  readonly parentId?: string;
  readonly rateLimitPerUser?: number;
};
