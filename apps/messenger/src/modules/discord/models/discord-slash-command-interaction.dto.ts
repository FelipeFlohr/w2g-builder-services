import { DiscordSlashCommandInteractionDTOOptionsType } from "../types/discord-slash-command-interaction-dto-options.type";

export class DiscordSlashCommandInteractionDTO {
  public readonly channelId: string;
  public readonly guildId?: string;
  public readonly commandName: string;
  public readonly data: Record<string, unknown>;

  public constructor(options: DiscordSlashCommandInteractionDTOOptionsType) {
    this.channelId = options.channelId;
    this.guildId = options.guildId;
    this.commandName = options.commandName;
    this.data = options.data;
  }
}
