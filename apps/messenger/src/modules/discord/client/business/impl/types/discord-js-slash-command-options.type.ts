import { DiscordSlashCommandParameter } from "../../discord-slash-command-parameter";

export type DiscordJsSlashCommandOptions = {
  readonly name: string;
  readonly description: string;
  readonly dmPermission: boolean;
  readonly parameters?: Array<DiscordSlashCommandParameter>;
};
