import { DiscordSlashCommandParameter } from "../discord-slash-command-parameter";
import { DiscordParameterTypeEnum } from "../types/discord-parameter-type.enum";
import { DiscordJsSlashCommandParameterOptions } from "./types/discord-js-slash-command-parameter.options";

export class DiscordJsSlashCommandParameterImpl
  implements DiscordSlashCommandParameter
{
  public readonly description: string;
  public readonly name: string;
  public readonly required: boolean;
  public readonly type: DiscordParameterTypeEnum;

  public constructor(options: DiscordJsSlashCommandParameterOptions) {
    this.description = options.description;
    this.name = options.name;
    this.required = options.required;
    this.type = options.type;
  }
}
