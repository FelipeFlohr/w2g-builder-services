import { DiscordGuildSlashCommandInteractionDTOOptionsType } from "../types/discord-guild-slash-command-interaction-dto-options.type";
import { DiscordSlashCommandInteractionDTO } from "./discord-slash-command-interaction.dto";

export class DiscordGuildSlashCommandInteractionDTO extends DiscordSlashCommandInteractionDTO {
  public override readonly guildId: string;

  public constructor(options: DiscordGuildSlashCommandInteractionDTOOptionsType) {
    super(options);
  }
}
