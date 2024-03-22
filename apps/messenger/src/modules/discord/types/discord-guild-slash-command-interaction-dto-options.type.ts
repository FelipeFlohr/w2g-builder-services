import { DiscordSlashCommandInteractionDTOOptionsType } from "./discord-slash-command-interaction-dto-options.type";

export type DiscordGuildSlashCommandInteractionDTOOptionsType = DiscordSlashCommandInteractionDTOOptionsType & {
  readonly guildId: string;
};
