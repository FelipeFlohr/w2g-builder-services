import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { DiscordDelimitationMessageEntity } from "../entities/discord-delimitation-message.entity";
import { DiscordListenerEntity } from "../entities/discord-listener.entity";
import { ChannelNameDTO } from "../models/channel-name.dto";
import { GuildWithChannelIdsDTO } from "../models/guild-with-channel-ids.dto";
import { GuildWithImageLinkDTO } from "../models/guild-with-image-link.dto";

export interface MessengerService {
  listenerExistsByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean>;
  saveListenerByChannelIdAndGuildId(channelId: string, guildId: string): Promise<DiscordListenerEntity>;
  deleteListenerByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean>;
  setupSlashCommands(): Promise<void>;
  saveMessage(message: DiscordMessageDTO): Promise<void>;
  updateMessage(message: DiscordMessageDTO): Promise<void>;
  deleteMessage(message: DiscordMessageDTO): Promise<void>;
  saveDelimitationMessageByMessageIdAndChannelIdAndGuildId(
    messageId: string,
    channelId: string,
    guildId: string,
  ): Promise<DiscordDelimitationMessageEntity | undefined>;
  deleteDelimitationMessageByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean>;
  getDelimitationMessageUrlByChannelIdAndGuildId(channelId: string, guildId: string): Promise<string | undefined>;
  getGuildsWithImageLink(guildIds: Array<string>): Promise<Array<GuildWithImageLinkDTO>>;
  getChannelNames(guildWithChannelIds: GuildWithChannelIdsDTO): Promise<Array<ChannelNameDTO>>;
}
