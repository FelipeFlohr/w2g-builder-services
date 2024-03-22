import { DiscordGuildSlashCommandInteractionDTO } from "./discord-guild-slash-command-interaction.dto";
import { DiscordSlashCommandInteractionDTO } from "./discord-slash-command-interaction.dto";
import { DiscordSlashCommandDTO } from "./discord-slash-command.dto";

export abstract class DiscordGuildSlashCommandDTO extends DiscordSlashCommandDTO {
  public abstract onGuildInteraction(interaction: DiscordGuildSlashCommandInteractionDTO): Promise<string>;

  public override async onInteraction(interaction: DiscordSlashCommandInteractionDTO): Promise<string> {
    if (interaction.guildId == undefined) {
      return "Guild not found";
    }

    return await this.onGuildInteraction(interaction as DiscordGuildSlashCommandInteractionDTO);
  }
}
