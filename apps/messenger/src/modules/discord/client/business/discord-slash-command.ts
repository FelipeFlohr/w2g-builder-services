import { Equatable } from "src/utils/type-utils";
import { DiscordSlashCommandInteraction } from "./discord-slash-command-interaction";

export interface DiscordSlashCommand extends Equatable<DiscordSlashCommand> {
  readonly name: string;
  readonly description: string;
  readonly dmPermission: boolean;
  onInteraction(interaction: DiscordSlashCommandInteraction): Promise<void>;
}
