import { Equatable } from "src/utils/type-utils";
import { DiscordSlashCommandInteraction } from "./discord-slash-command-interaction";
import { DiscordSlashCommandParameter } from "./discord-slash-command-parameter";

export interface DiscordSlashCommand extends Equatable<DiscordSlashCommand> {
  readonly name: string;
  readonly description: string;
  readonly dmPermission: boolean;
  readonly parameters?: Array<DiscordSlashCommandParameter>;
  onInteraction(interaction: DiscordSlashCommandInteraction): Promise<void>;
}
