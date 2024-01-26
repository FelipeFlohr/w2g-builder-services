import { ChatInputCommandInteraction } from "discord.js";

export type DiscordJsSlashCommandInteractionOptions = {
  readonly guildId?: string;
  readonly channelId: string;
  readonly commandName: string;
  readonly data?: Record<string, unknown>;
  readonly interaction: ChatInputCommandInteraction;
};
