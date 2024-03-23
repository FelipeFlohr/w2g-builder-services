import { DiscordSlashCommandParameterDTO } from "../models/discord-slash-command-parameter.dto";

export type DiscordSlashCommandDTOOptionsType = {
  readonly name: string;
  readonly description: string;
  readonly dmPermission: boolean;
  readonly parameters?: Array<DiscordSlashCommandParameterDTO>;
};
