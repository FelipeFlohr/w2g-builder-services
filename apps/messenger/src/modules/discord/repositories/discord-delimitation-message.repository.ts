import { DiscordDelimitationMessageEntity } from "../entities/discord-delimitation-message.entity";
import { DiscordDelimitationMessageWithListenerDTO } from "../models/discord-delimitation-message-with-listener.dto";
import { DiscordMessageDTO } from "../models/discord-message.dto";

export interface DiscordDelimitationMessageRepository {
  saveDelimitation(message: DiscordMessageDTO): Promise<number>;
  getDelimitationMessagesWithListener(): Promise<Array<DiscordDelimitationMessageWithListenerDTO>>;
  delimitationMessageExistsByGuildAndChannelId(guildId: string, channelId: string): Promise<boolean>;
  deleteDelimitationByGuildAndChannelId(guildId: string, channelId: string): Promise<void>;
  getDelimitationMessageLinkByGuildAndChannelId(guildId: string, channelId: string): Promise<string | undefined>;
  getDelimitationMessageByGuildAndChannelId(
    guildId: string,
    channelId: string,
  ): Promise<DiscordDelimitationMessageEntity>;
}

export const DiscordDelimitationMessageRepository = Symbol("DiscordDelimitationMessageRepository");
