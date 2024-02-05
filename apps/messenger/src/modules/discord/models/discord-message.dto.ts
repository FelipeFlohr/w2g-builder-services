import { DiscordMessageDTOOptions } from "../types/discord-message-dto-options.type";
import { DiscordMessageAuthorDTO } from "./discord-message-author.dto";

export class DiscordMessageDTO {
  public readonly applicationId?: string;
  public readonly author: DiscordMessageAuthorDTO;
  public readonly cleanContent: string;
  public readonly content: string;
  public readonly createdAt: Date;
  public readonly hasThread: boolean;
  public readonly id: string;
  public readonly pinnable: boolean;
  public readonly pinned: boolean;
  public readonly position?: number;
  public readonly system: boolean;
  public readonly url: string;
  public readonly guildId: string;
  public readonly channelId: string;
  public readonly deleted: boolean;

  public constructor(options: DiscordMessageDTOOptions) {
    this.applicationId = options.applicationId;
    this.author = options.author;
    this.cleanContent = options.cleanContent;
    this.content = options.content;
    this.createdAt = options.createdAt;
    this.hasThread = options.hasThread;
    this.id = options.id;
    this.pinnable = options.pinnable;
    this.pinned = options.pinned;
    this.position = options.position;
    this.system = options.system;
    this.url = options.url;
    this.guildId = options.guildId;
    this.channelId = options.channelId;
    this.deleted = options.deleted;
  }
}
