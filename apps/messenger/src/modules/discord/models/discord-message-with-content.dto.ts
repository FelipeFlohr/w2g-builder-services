export class DiscordMessageWithContentDTO {
  public readonly messageId: number;
  public readonly discordMessageId: string;
  public readonly content: string;

  public constructor(messageId: number, discordMessageId: string, content: string) {
    this.messageId = messageId;
    this.discordMessageId = discordMessageId;
    this.content = content;
  }
}
