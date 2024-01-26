import { DiscordMessageDTO } from "../models/discord-message.dto";

export interface DiscordAMQPService {
  sendCreatedMessage(message: DiscordMessageDTO): Promise<void>;
  sendDeletedMessage(message: DiscordMessageDTO): Promise<void>;
}

export const DiscordAMQPService = Symbol("DiscordAMQPService");
