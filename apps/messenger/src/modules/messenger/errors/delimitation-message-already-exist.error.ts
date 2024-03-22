import { DiscordCommandError } from "../../discord/base/discord-command.error";

export class DelimitationMessageAlreadyExistError extends DiscordCommandError {
  public readonly messageId: string;

  public constructor(messageId: string) {
    super(`Message is already a delimitation.`);
    this.messageId = messageId;
  }
}
