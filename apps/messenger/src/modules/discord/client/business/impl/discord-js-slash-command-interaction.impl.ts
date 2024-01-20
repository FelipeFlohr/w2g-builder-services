import { ChatInputCommandInteraction, DiscordAPIError } from "discord.js";
import { DiscordSlashCommandInteraction } from "../discord-slash-command-interaction";
import { TypeUtils } from "src/utils/type-utils";
import { DiscordJsSlashCommandInteractionOptions } from "../types/discord-js-slash-command-interaction-options.type";
import { DiscordErrorCodeEnum } from "src/utils/discord-error-code.enum";
import { Logger } from "@nestjs/common";

export class DiscordJsSlashCommandInteractionImpl
  implements DiscordSlashCommandInteraction
{
  public readonly channelId: string;
  public readonly guildId?: string;
  public readonly commandName: string;
  private readonly interaction: ChatInputCommandInteraction;

  private static readonly logger = new Logger(
    DiscordJsSlashCommandInteractionImpl.name,
  );

  public constructor(options: DiscordJsSlashCommandInteractionOptions) {
    this.channelId = options.channelId;
    this.guildId = options.guildId;
    this.commandName = options.commandName;
    this.interaction = options.interaction;
  }

  public async reply(message: string): Promise<void> {
    try {
      await this.interaction.reply(message);
    } catch (e) {
      if (
        e instanceof DiscordAPIError &&
        e.code === DiscordErrorCodeEnum.UNKNOWN_INTERACTION
      ) {
        DiscordJsSlashCommandInteractionImpl.logger.error(e);
        return;
      }
      throw e;
    }
  }

  public static fromJsInteraction(
    interaction: ChatInputCommandInteraction,
  ): DiscordJsSlashCommandInteractionImpl {
    return new DiscordJsSlashCommandInteractionImpl({
      channelId: interaction.channelId,
      commandName: interaction.commandName,
      guildId: TypeUtils.parseNullToUndefined(interaction.guildId),
      interaction: interaction,
    });
  }
}
