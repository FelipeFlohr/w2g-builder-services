import { DiscordMessageDTO } from "./discord-message.dto";

export class DiscordDelimitationMessageDTO {
  public readonly createdAt: Date;
  public readonly message: DiscordMessageDTO;

  public constructor(createdAt: Date, message: DiscordMessageDTO) {
    this.createdAt = createdAt;
    this.message = message;
  }
}
