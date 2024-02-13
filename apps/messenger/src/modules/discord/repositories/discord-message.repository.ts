import { DiscordMessageDTO } from "../models/discord-message.dto";
import { DiscordPersistedMessageStatusEnum } from "../types/discord-persisted-message-status.enum";

export interface DiscordMessageRepository {
  saveMessage(message: DiscordMessageDTO, forceCreation?: boolean): Promise<number>;
  updateMessage(message: DiscordMessageDTO): Promise<void>;
  updateMessageById(messageId: number, message: DiscordMessageDTO): Promise<void>;
  softDeleteMessage(message: DiscordMessageDTO): Promise<void>;
  upsertMessage(message: DiscordMessageDTO): Promise<DiscordPersistedMessageStatusEnum>;
}

export const DiscordMessageRepository = Symbol("DiscordMessageRepository");
