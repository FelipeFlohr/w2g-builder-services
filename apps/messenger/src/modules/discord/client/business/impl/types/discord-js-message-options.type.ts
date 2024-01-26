import { Message } from "discord.js";
import { DiscordMessageAuthor } from "../../discord-message-author";

export type DiscordJsMessageOptions = {
  readonly applicationId?: string;
  readonly author: DiscordMessageAuthor;
  readonly cleanContent: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly hasThread: boolean;
  readonly id: string;
  readonly pinnable: boolean;
  readonly pinned: boolean;
  readonly position?: number;
  readonly system: boolean;
  readonly url: string;
  readonly guildId: string;
  readonly channelId: string;
  readonly message: Message<true>;
};
