export interface DiscordSlashCommandInteraction {
  readonly channelId: string;
  readonly guildId?: string;
  reply(message: string): Promise<void>;
}
