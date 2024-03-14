import { DiscordParameterTypeEnum } from "../enums/discord-parameter-type.enum";

export type DiscordSlashCommandParameterDTOOptionsType = {
  readonly name: string;
  readonly description: string;
  readonly required: boolean;
  readonly type: DiscordParameterTypeEnum;
};
