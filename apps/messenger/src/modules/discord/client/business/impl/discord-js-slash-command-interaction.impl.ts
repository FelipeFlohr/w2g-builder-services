import { ChatInputCommandInteraction, DiscordAPIError } from "discord.js";
import { DiscordSlashCommandInteraction } from "../discord-slash-command-interaction";
import { TypeUtils } from "src/utils/type-utils";
import { DiscordJsSlashCommandInteractionOptions } from "./types/discord-js-slash-command-interaction-options.type";
import { DiscordErrorCodeEnum } from "src/utils/discord-error-code.enum";
import { LoggerUtils } from "src/utils/logger-utils";

export class DiscordJsSlashCommandInteractionImpl
  implements DiscordSlashCommandInteraction
{
  public readonly channelId: string;
  public readonly guildId?: string;
  public readonly commandName: string;
  public readonly data: Record<string, unknown>;
  private readonly interaction: ChatInputCommandInteraction;

  private static readonly logger = LoggerUtils.from(
    DiscordJsSlashCommandInteractionImpl,
  );

  public constructor(options: DiscordJsSlashCommandInteractionOptions) {
    this.channelId = options.channelId;
    this.guildId = options.guildId;
    this.commandName = options.commandName;
    this.data = options.data ?? {};
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
    const data: Record<string, unknown> = {};
    for (const dataJs of interaction.options.data) {
      data[dataJs.name] = dataJs.value;
    }

    return new DiscordJsSlashCommandInteractionImpl({
      channelId: interaction.channelId,
      commandName: interaction.commandName,
      guildId: TypeUtils.parseNullToUndefined(interaction.guildId),
      data: data,
      interaction: interaction,
    });
  }
}
