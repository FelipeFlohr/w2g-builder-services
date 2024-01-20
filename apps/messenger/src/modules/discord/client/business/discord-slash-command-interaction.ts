export interface DiscordSlashCommandInteraction {
  readonly channelId: string;
  readonly guildId?: string;
  readonly commandName: string;
  reply(message: string): Promise<void>;
}
