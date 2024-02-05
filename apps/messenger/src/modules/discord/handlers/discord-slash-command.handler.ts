import { DiscordSlashCommandInteraction } from "../client/business/discord-slash-command-interaction";

export interface DiscordSlashCommandHandler {
  handleSlashCommandByInteraction(interaction: DiscordSlashCommandInteraction): Promise<void>;
}

export const DiscordSlashCommandHandler = Symbol("DiscordSlashCommandHandler");
