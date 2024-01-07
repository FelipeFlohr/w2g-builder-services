import { DiscordChannelDTOOptions } from "./discord-channel-dto-options.type";
import { DiscordParentCategoryDTOOptions } from "./discord-parent-category-dto-options.type";

export type DiscordTextChannelDTOOptions = DiscordChannelDTOOptions & {
  readonly lastMessageId?: string;
  readonly parent?: DiscordParentCategoryDTOOptions;
  readonly rateLimitPerUser?: number;
};
