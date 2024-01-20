import { SlashCommandBuilder } from "discord.js";
import { DiscordSlashCommand } from "../discord-slash-command";
import { DiscordSlashCommandInteraction } from "../discord-slash-command-interaction";

export abstract class DiscordJsSlashCommandImpl implements DiscordSlashCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly dmPermission: boolean;

  public constructor(name: string, description: string, dmPermission: boolean) {
    this.name = name;
    this.description = description;
    this.dmPermission = dmPermission;
  }

  public abstract onInteraction(
    interaction: DiscordSlashCommandInteraction,
  ): Promise<void>;

  public toSlashCommand(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .setDMPermission(this.dmPermission);
  }

  public equals(val: DiscordSlashCommand): boolean {
    return this.name === val.name;
  }

  protected async guildDoesNotExistsInteraction(
    interaction: DiscordSlashCommandInteraction,
  ): Promise<void> {
    await interaction.reply("Guild not found");
  }
}
