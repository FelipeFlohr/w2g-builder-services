import { DiscordMessageDTO } from "../models/discord-message.dto";

export interface DiscordDelimitationMessageRepository {
  saveDelimitation(message: DiscordMessageDTO): Promise<number>;
}

export const DiscordDelimitationMessageRepository = Symbol(
  "DiscordDelimitationMessageRepository",
);
