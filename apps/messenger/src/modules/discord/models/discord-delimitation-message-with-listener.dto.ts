import { DiscordDelimitationMessageWithListenerOptions } from "../types/discord-delimitation-message-with-listener-options.type";

export class DiscordDelimitationMessageWithListenerDTO {
  public readonly delimitationId: number;
  public readonly channelId: string;
  public readonly guildId: string;
  public readonly messageId: number;
  public readonly discordMessageId: string;

  public constructor(options: DiscordDelimitationMessageWithListenerOptions) {
    this.delimitationId = options.delimitationId;
    this.channelId = options.channelId;
    this.guildId = options.guildId;
    this.messageId = options.messageId;
    this.discordMessageId = options.discordMessageId;
  }
}
