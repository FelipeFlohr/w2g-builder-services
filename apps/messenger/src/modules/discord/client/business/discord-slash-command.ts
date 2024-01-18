import { DiscordSlashCommandInteraction } from "./discord-slash-command-interaction";

export interface DiscordSlashCommand {
  readonly name: string;
  readonly description: string;
  readonly dmPermission: boolean;
  onInteraction(interaction: DiscordSlashCommandInteraction): Promise<void>;
}
