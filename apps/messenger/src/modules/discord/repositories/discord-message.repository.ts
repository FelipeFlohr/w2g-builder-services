import { DiscordMessageDTO } from "../models/discord-message.dto";

export interface DiscordMessageRepository {
  saveMessage(message: DiscordMessageDTO, forceCreation?: boolean): Promise<number>;
  updateMessage(message: DiscordMessageDTO): Promise<void>;
  updateMessageById(messageId: number, message: DiscordMessageDTO): Promise<void>;
  softDeleteMessage(message: DiscordMessageDTO): Promise<void>;
}

export const DiscordMessageRepository = Symbol("DiscordMessageRepository");
