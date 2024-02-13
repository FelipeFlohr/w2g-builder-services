import { DiscordGuild } from "../client/business/discord-guild";
import { DiscordGuildInfo } from "../client/business/discord-guild-info";
import { DiscordMessage } from "../client/business/discord-message";
import { DiscordTextChannel } from "../client/business/discord-text-channel";
import { GuildFetchOptionsType } from "../client/types/guild-fetch-options.type";
import { MessageFetchOptions } from "../client/types/message-fetch-options.type";
import { DiscordDelimitationMessageEntity } from "../entities/discord-delimitation-message.entity";
import { DiscordDelimitationMessageWithListenerDTO } from "../models/discord-delimitation-message-with-listener.dto";
import { DiscordMessageAuthorDTO } from "../models/discord-message-author.dto";
import { DiscordMessageDTO } from "../models/discord-message.dto";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";

export interface DiscordService {
  fetchGuilds(options?: GuildFetchOptionsType): Promise<Array<DiscordGuildInfo>>;
  fetchGuildById(id: string): Promise<DiscordGuild | undefined>;
  fetchTextChannels(guildId: string): Promise<Array<DiscordTextChannel>>;
  fetchTextChannelById(guildId: string, channelId: string): Promise<DiscordTextChannel | undefined>;
  fetchChannelMessages(options: MessageFetchOptions): Promise<Array<DiscordMessage>>;
  fetchMessageById(guildId: string, channelId: string, messageId: string): Promise<DiscordMessage | undefined>;
  saveTextChannelListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  listenerExists(listener: DiscordTextChannelListenerDTO): Promise<boolean>;
  deleteListener(listener: DiscordTextChannelListenerDTO): Promise<void>;
  fetchListeners(): Promise<Array<DiscordTextChannelListenerDTO>>;
  saveDelimitationMessage(message: DiscordMessage): Promise<void>;
  saveMessage(message: DiscordMessageDTO, forceCreation?: boolean): Promise<number>;
  softDeleteMessage(message: DiscordMessageDTO): Promise<void>;
  updateMessage(message: DiscordMessageDTO): Promise<void>;
  updateMessageById(messageId: number, message: DiscordMessageDTO): Promise<void>;
  fetchDelimitationMessagesWithListener(): Promise<Array<DiscordDelimitationMessageWithListenerDTO>>;
  updateMessageAuthorById(authorId: number, authorDTO: DiscordMessageAuthorDTO): Promise<void>;
  saveAuthor(author: DiscordMessageAuthorDTO): Promise<number>;
  getDelimitationMessageLinkByGuildAndChannelId(guildId: string, channelId: string): Promise<string | undefined>;
  getDelimitationMessageByGuildAndChannelId(
    guildId: string,
    channelId: string,
  ): Promise<DiscordDelimitationMessageEntity>;
  setupSlashCommands(): Promise<void>;
  cacheChannelMessages(
    isBootstrap: boolean,
    delimitationMessage: DiscordDelimitationMessageWithListenerDTO,
  ): Promise<void>;
  cacheChannelMessages(guildId: string, channelId: string, isBootstrap: boolean): Promise<void>;
  sendDelimitationMessageViaAMQP(message: DiscordMessageDTO): Promise<void>;
}

export const DiscordService = Symbol("DiscordService");
