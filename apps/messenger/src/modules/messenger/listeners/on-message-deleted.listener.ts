import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { DiscordMessageListener } from "./base/discord-message.listener";

export class OnMessageDeletedListener extends DiscordMessageListener {
  public async onMessage(message: DiscordMessageDTO): Promise<void> {
    await this.service.deleteMessage(message);
  }
}
