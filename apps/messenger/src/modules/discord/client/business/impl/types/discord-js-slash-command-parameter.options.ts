import { DiscordParameterTypeEnum } from "../../types/discord-parameter-type.enum";

export type DiscordJsSlashCommandParameterOptions = {
  readonly description: string;
  readonly name: string;
  readonly required: boolean;
  readonly type: DiscordParameterTypeEnum;
};
