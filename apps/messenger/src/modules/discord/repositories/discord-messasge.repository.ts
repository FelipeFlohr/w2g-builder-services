import { DiscordMessageDTO } from "../models/discord-message.dto";

export interface DiscordMessageRepository {
  saveMessage(message: DiscordMessageDTO): Promise<number>;
  deleteMessageByMessageId(messageId: string): Promise<void>;
}

export const DiscordMessageRepository = Symbol("DiscordMessageRepository");
