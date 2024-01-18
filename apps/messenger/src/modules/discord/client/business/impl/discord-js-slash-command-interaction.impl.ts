import { ChatInputCommandInteraction } from "discord.js";
import { DiscordSlashCommandInteraction } from "../discord-slash-command-interaction";
import { TypeUtils } from "src/utils/type-utils";

export class DiscordJsSlashCommandInteractionImpl
  implements DiscordSlashCommandInteraction
{
  public readonly channelId: string;
  public readonly guildId?: string;
  private readonly interaction: ChatInputCommandInteraction;

  public constructor(
    interaction: ChatInputCommandInteraction,
    channelId: string,
    guildId?: string,
  ) {
    this.interaction = interaction;
    this.channelId = channelId;
    this.guildId = guildId;
  }

  public async reply(message: string): Promise<void> {
    await this.interaction.reply(message);
  }

  public static fromJsInteraction(
    interaction: ChatInputCommandInteraction,
  ): DiscordJsSlashCommandInteractionImpl {
    return new DiscordJsSlashCommandInteractionImpl(
      interaction,
      interaction.channelId,
      TypeUtils.parseNullToUndefined(interaction.guildId),
    );
  }
}
