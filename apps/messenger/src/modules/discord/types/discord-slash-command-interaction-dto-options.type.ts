export type DiscordSlashCommandInteractionDTOOptionsType = {
  readonly channelId: string;
  readonly guildId?: string;
  readonly commandName: string;
  readonly data: Record<string, unknown>;
};
