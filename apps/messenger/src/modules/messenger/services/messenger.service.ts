import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { DiscordDelimitationMessageEntity } from "../entities/discord-delimitation-message.entity";
import { DiscordListenerEntity } from "../entities/discord-listener.entity";

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
}
