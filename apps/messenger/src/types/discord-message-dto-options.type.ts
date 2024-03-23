import { DiscordMessageAuthorDTO } from "src/models/discord-message-author.dto";

export type DiscordMessageDTOOptions = {
  readonly applicationId?: string;
  readonly author: DiscordMessageAuthorDTO;
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
};
