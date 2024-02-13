import { DiscordGuildInfoDTO } from "../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../models/discord-guild.dto";
import { DiscordMessageDTO } from "../models/discord-message.dto";
import { DiscordTextChannelDTO } from "../models/discord-text-channel.dto";
import { GetGuildsQueryDTO } from "../models/get-guilds-query.dto";
import { GetMessagesQueryDTO } from "../models/get-messages-query.dto";

export interface DiscordController {
  getGuilds(query?: GetGuildsQueryDTO): Promise<Array<DiscordGuildInfoDTO>>;
  getGuild(id: string): Promise<DiscordGuildDTO>;
  getTextChannels(guildId: string): Promise<Array<DiscordTextChannelDTO>>;
  getTextChannelById(guildId: string, channelId: string): Promise<DiscordTextChannelDTO>;
  getMessagesFromTextChannel(
    guildId: string,
    channelId: string,
    options?: GetMessagesQueryDTO,
  ): Promise<Array<DiscordMessageDTO>>;
  setupSlashCommands(): Promise<void>;
}
