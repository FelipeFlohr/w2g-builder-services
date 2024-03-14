import { DiscordDelimitationMessageDTO } from "src/models/discord-demilitation-message.dto";
import { DiscordMessageDTO } from "src/models/discord-message.dto";

export interface DiscordAMQPService {
  sendCreatedMessage(message: DiscordMessageDTO): Promise<void>;
  sendUpdatedMessage(message: DiscordMessageDTO): Promise<void>;
  sendDeletedMessage(message: DiscordMessageDTO): Promise<void>;
  sendBootstrapMessage(message: DiscordMessageDTO): Promise<void>;
  sendDelimitationMessage(message: DiscordDelimitationMessageDTO): Promise<void>;
}
