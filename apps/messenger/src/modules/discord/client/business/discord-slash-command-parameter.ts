import { DiscordParameterTypeEnum } from "./types/discord-parameter-type.enum";

export interface DiscordSlashCommandParameter {
  readonly name: string;
  readonly description: string;
  readonly required: boolean;
  readonly type: DiscordParameterTypeEnum;
}
