import { DiscordDelimitationMessageDTO } from "./discord-delimitation-message.dto";
import { DiscordMessageDTO } from "./discord-message.dto";

export class DiscordPersistedDelimitationMessageDTO extends DiscordDelimitationMessageDTO {
  public readonly id: number;

  public constructor(id: number, createdAt: Date, message: DiscordMessageDTO) {
    super(createdAt, message);
    this.id = id;
  }
}
