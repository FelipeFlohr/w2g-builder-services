import { DiscordMessage } from "../client/business/discord-message";

export interface DiscordTextChannelListener {
  onMessageCreated(message: DiscordMessage): Promise<void>;
  onMessageDeleted(message: DiscordMessage): Promise<void>;
  onMessageEdited(message: DiscordMessage): Promise<void>;
}
