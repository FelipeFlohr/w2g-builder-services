import { MessengerBaseEntity } from "src/modules/database/base/messenger-base.entity";

export interface DiscordListenerEntity extends MessengerBaseEntity<DiscordListenerEntity> {
  id: number;
  guildId: string;
  channelId: string;
}
