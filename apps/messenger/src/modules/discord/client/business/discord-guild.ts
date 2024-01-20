import { DiscordGuildDTO } from "../../models/discord-guild.dto";
import { DiscordChannel } from "./discord-channel";
import { DiscordSlashCommand } from "./discord-slash-command";

export interface DiscordGuild {
  readonly applicationId?: string;
  readonly memberCount: number;
  readonly available: boolean;
  readonly createdAt: Date;
  readonly id: string;
  readonly joinedAt: Date;
  readonly ownerId: string;
  readonly name: string;
  readonly large: boolean;
  fetchChannels(): Promise<Array<DiscordChannel>>;
  fetchChannelById(id: string): Promise<DiscordChannel | undefined>;
  addCommand(command: DiscordSlashCommand): Promise<void>;
  removeAllCommands(): Promise<void>;
  toDTO(): DiscordGuildDTO;
}
