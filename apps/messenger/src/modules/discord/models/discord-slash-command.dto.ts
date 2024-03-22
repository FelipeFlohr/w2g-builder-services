import { DiscordSlashCommandDTOOptionsType } from "../types/discord-slash-command-dto-options.type";
import { DiscordSlashCommandInteractionDTO } from "./discord-slash-command-interaction.dto";
import { DiscordSlashCommandParameterDTO } from "./discord-slash-command-parameter.dto";

export abstract class DiscordSlashCommandDTO {
  public readonly name: string;
  public readonly description: string;
  public readonly dmPermission: boolean;
  public readonly parameters?: Array<DiscordSlashCommandParameterDTO>;

  public constructor(options: DiscordSlashCommandDTOOptionsType) {
    this.name = options.name;
    this.description = options.description;
    this.dmPermission = options.dmPermission;
    this.parameters = options.parameters;
  }

  public abstract onInteraction(interaction: DiscordSlashCommandInteractionDTO): Promise<string>;
}
