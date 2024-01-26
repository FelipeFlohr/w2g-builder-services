export interface DiscordSlashCommandInteraction {
  readonly channelId: string;
  readonly guildId?: string;
  readonly commandName: string;
  readonly data: Record<string, unknown>;
  reply(message: string): Promise<void>;
}
