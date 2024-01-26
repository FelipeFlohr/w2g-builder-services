import { Message, PartialMessage } from "discord.js";
import { DiscordMessage } from "../discord-message";
import { DiscordMessageAuthor } from "../discord-message-author";
import { DiscordJsMessageOptions } from "./types/discord-js-message-options.type";
import { DiscordJsMessageAuthorImpl } from "./discord-js-message-author.impl";
import { TypeUtils } from "src/utils/type-utils";
import { DiscordMessageDTO } from "src/modules/discord/models/discord-message.dto";

export class DiscordJsMessageImpl implements DiscordMessage {
  public readonly applicationId?: string;
  public readonly author: DiscordMessageAuthor;
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
  public isFetched: boolean;
  private readonly message: Message;

  public constructor(options: DiscordJsMessageOptions) {
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
    this.message = options.message;
    this.guildId = options.guildId;
    this.channelId = options.channelId;
    this.isFetched = this.isMessageFetched();
  }

  public static fromJsFetchedMessage(
    message: Message<true>,
  ): DiscordJsMessageImpl {
    return new DiscordJsMessageImpl({
      author: DiscordJsMessageAuthorImpl.fromJsAuthor(message.author),
      cleanContent: message.cleanContent,
      content: message.content,
      createdAt: message.createdAt,
      hasThread: message.hasThread,
      id: message.id,
      message: message,
      pinnable: message.pinnable,
      pinned: message.pinned,
      system: message.system,
      url: message.url,
      applicationId: TypeUtils.parseNullToUndefined(message.applicationId),
      position: TypeUtils.parseNullToUndefined(message.position),
      channelId: message.channelId,
      guildId: message.guildId,
    });
  }

  public static fromJsMessage(
    message: Message | PartialMessage,
  ): DiscordJsMessageImpl | undefined {
    if (!message.partial) {
      return this.fromJsFetchedMessage(message as Message<true>);
    }
  }

  public toDTO(): DiscordMessageDTO {
    return new DiscordMessageDTO({
      author: this.author.toDTO(),
      cleanContent: this.cleanContent,
      content: this.content,
      createdAt: this.createdAt,
      hasThread: this.hasThread,
      id: this.id,
      pinnable: this.pinnable,
      pinned: this.pinned,
      system: this.system,
      url: this.url,
      applicationId: this.applicationId,
      position: this.position,
      channelId: this.channelId,
      guildId: this.guildId,
    });
  }

  public async fetch(): Promise<DiscordMessage> {
    if (!this.isFetched) {
      await this.message.fetch();
      this.isFetched = true;
    }
    return this;
  }

  private isMessageFetched(): boolean {
    return !this.message.partial;
  }
}
