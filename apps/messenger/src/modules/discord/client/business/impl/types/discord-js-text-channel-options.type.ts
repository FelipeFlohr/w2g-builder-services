import { TextChannel } from "discord.js";
import { DiscordJsChannelOptions } from "./discord-js-channel-options.type";
import { DiscordJsParentCategoryOptions } from "./discord-js-parent-category-options.type";

export type DiscordJsTextChannelOptions = DiscordJsChannelOptions & {
  readonly lastMessageId?: string;
  readonly parent?: DiscordJsParentCategoryOptions;
  readonly rateLimitPerUser?: number;
  readonly channel: TextChannel;
};
