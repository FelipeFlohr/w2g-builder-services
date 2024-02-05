import { DiscordMessageAuthorDTO } from "../models/discord-message-author.dto";

export interface DiscordMessageAuthorRepository {
  updateAuthorById(authorId: number, authorDTO: DiscordMessageAuthorDTO): Promise<void>;
  saveAuthor(author: DiscordMessageAuthorDTO): Promise<number>;
}

export const DiscordMessageAuthorRepository = Symbol("DiscordMessageAuthorRepository");
