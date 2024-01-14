import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordMessageAuthor } from "./discord-message-author";

export interface DiscordMessage {
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
  readonly isFetched: boolean;
  fetch(): Promise<DiscordMessage>;
  toDTO(): DiscordMessageDTO;
}
