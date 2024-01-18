import { DiscordSlashCommand } from "../client/business/discord-slash-command";

export interface DiscordCommandRepository {
  commands: Array<DiscordSlashCommand>;
}

export const DiscordCommandRepository = Symbol("DiscordCommandRepository");
