import { DiscordParameterTypeEnum } from "../enums/discord-parameter-type.enum";
import { DiscordSlashCommandParameterDTOOptionsType } from "../types/discord-slash-command-parameter-dto-options.type";

export class DiscordSlashCommandParameterDTO {
  public readonly name: string;
  public readonly description: string;
  public readonly required: boolean;
  public readonly type: DiscordParameterTypeEnum;

  public constructor(options: DiscordSlashCommandParameterDTOOptionsType) {
    this.name = options.name;
    this.description = options.description;
    this.required = options.required;
    this.type = options.type;
  }
}
