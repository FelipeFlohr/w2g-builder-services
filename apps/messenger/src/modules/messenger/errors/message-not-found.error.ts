import { DiscordCommandError } from "../../discord/base/discord-command.error";

export class MessageNotFoundError extends DiscordCommandError {
  public readonly messageId: string;

  public constructor(messageId: string) {
    super(`Message not found with ID ${messageId}`);
    this.messageId = messageId;
  }
}
