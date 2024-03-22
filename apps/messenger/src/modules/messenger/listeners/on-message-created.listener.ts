import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { DiscordMessageListener } from "./base/discord-message.listener";

export class OnMessageCreatedListener extends DiscordMessageListener {
  public async onMessage(message: DiscordMessageDTO): Promise<void> {
    await this.service.saveMessage(message);
  }
}
