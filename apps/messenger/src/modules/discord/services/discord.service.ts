import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { DiscordChannelDTO } from "../models/discord-channel.dto";
import { DiscordGuildInfoDTO } from "../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../models/discord-guild.dto";
import { GuildFetchOptionsType } from "../types/guild-fetch-options.type";
import { MessageFetchOptionsType } from "../types/message-fetch-options.type";
import { DiscordSlashCommandDTO } from "../models/discord-slash-command.dto";
import { IMessageListener } from "../interfaces/message-listener.interface";

export interface DiscordService {
  fetchGuilds(options?: GuildFetchOptionsType): Promise<Array<DiscordGuildInfoDTO>>;
  fetchGuildById(id: string): Promise<DiscordGuildDTO | undefined>;
  fetchGuildByGuildInfo(guildInfo: DiscordGuildInfoDTO): Promise<DiscordGuildDTO | undefined>;
  fetchChannelsByGuildId(guildId: string): Promise<Array<DiscordChannelDTO>>;
  fetchChannelsByGuild(guild: DiscordGuildDTO): Promise<Array<DiscordChannelDTO>>;
  fetchChannelByIdAndGuildId(channelId: string, guildId: string): Promise<DiscordChannelDTO | undefined>;
  fetchMessages(options: MessageFetchOptionsType): Promise<Array<DiscordMessageDTO>>;
  fetchMessageByIdAndGuildIdAndChannelId(
    messageId: string,
    channelId: string,
    guildId: string,
  ): Promise<DiscordMessageDTO | undefined>;
  addSlashCommandToAllGuilds(command: DiscordSlashCommandDTO): Promise<void>;
  addSlashCommandToInteraction(command: DiscordSlashCommandDTO): void;
  deleteAllSlashCommandsFromAllGuilds(): Promise<void>;
  addMessageCreatedListener(listener: IMessageListener): void;
  addMessageUpdatedListener(listener: IMessageListener): void;
  addMessageDeletedListener(listener: IMessageListener): void;
}
