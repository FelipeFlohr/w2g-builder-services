import { DiscordTextChannelDTO } from "../../models/discord-text-channel.dto";
import { DiscordChannel } from "./discord-channel";
import { DiscordMessage } from "./discord-message";
import { DiscordParentCategory } from "./discord-parent-category";
import { MessageFetchOptions } from "./types/message-fetch-options.type";

export interface DiscordTextChannel extends DiscordChannel {
  readonly lastMessageId?: string;
  readonly parent?: DiscordParentCategory;
  readonly rateLimitPerUser?: number;
  fetchMessageById(id: string): Promise<DiscordMessage | undefined>;
  fetchMessages(options: MessageFetchOptions): Promise<Array<DiscordMessage>>;
  toDTO(): DiscordTextChannelDTO;
}
