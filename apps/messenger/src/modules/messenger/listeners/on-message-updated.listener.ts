import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { DiscordMessageListener } from "./base/discord-message.listener";

export class OnMessageUpdatedListener extends DiscordMessageListener {
  public async onMessage(message: DiscordMessageDTO): Promise<void> {
    await this.service.updateMessage(message);
  }
}
