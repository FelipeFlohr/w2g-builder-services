import { SlashCommandBuilder } from "discord.js";
import { DiscordSlashCommand } from "../discord-slash-command";
import { DiscordSlashCommandInteraction } from "../discord-slash-command-interaction";
import { DiscordSlashCommandParameter } from "../discord-slash-command-parameter";
import { DiscordJsSlashCommandOptions } from "./types/discord-js-slash-command-options.type";
import { DiscordParameterTypeEnum } from "../types/discord-parameter-type.enum";

export abstract class DiscordJsSlashCommandImpl implements DiscordSlashCommand {
  public readonly name: string;
  public readonly description: string;
  public readonly dmPermission: boolean;
  public readonly parameters?: Array<DiscordSlashCommandParameter>;

  protected constructor(options: DiscordJsSlashCommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.dmPermission = options.dmPermission;
    this.parameters = options.parameters;
  }

  public abstract onInteraction(interaction: DiscordSlashCommandInteraction): Promise<void>;

  public toSlashCommand(): SlashCommandBuilder {
    const slashBuilder = new SlashCommandBuilder()
      .setName(this.name)
      .setDescription(this.description)
      .setDMPermission(this.dmPermission);
    this.buildSlashParameters(slashBuilder);

    return slashBuilder;
  }

  public buildSlashParameters(slashBuilder: SlashCommandBuilder): void {
    if (this.parameters) {
      for (const parameter of this.parameters) {
        switch (parameter.type) {
          case DiscordParameterTypeEnum.INTEGER:
            this.buildIntegerParameter(slashBuilder, parameter);
            break;
          case DiscordParameterTypeEnum.STRING:
            this.buildStringParameter(slashBuilder, parameter);
            break;
        }
      }
    }
  }

  public equals(val: DiscordSlashCommand): boolean {
    return this.name === val.name;
  }

  protected async guildDoesNotExistsInteraction(interaction: DiscordSlashCommandInteraction): Promise<void> {
    await interaction.reply("Guild not found");
  }

  private buildIntegerParameter(slashBuilder: SlashCommandBuilder, parameter: DiscordSlashCommandParameter): void {
    slashBuilder.addIntegerOption((builder) => {
      builder.setDescription(parameter.description).setName(parameter.name).setRequired(parameter.required);

      return builder;
    });
  }

  private buildStringParameter(slashBuilder: SlashCommandBuilder, parameter: DiscordSlashCommandParameter): void {
    slashBuilder.addStringOption((builder) => {
      builder.setDescription(parameter.description).setName(parameter.name).setRequired(parameter.required);

      return builder;
    });
  }
}
