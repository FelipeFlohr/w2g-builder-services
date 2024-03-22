import { DiscordMessageDTO } from "src/models/discord-message.dto";

export interface IMessageListener {
  validateBeforeFetching(message: DiscordMessageDTO): Promise<boolean>;
  onMessage(message: DiscordMessageDTO): Promise<void>;
}
