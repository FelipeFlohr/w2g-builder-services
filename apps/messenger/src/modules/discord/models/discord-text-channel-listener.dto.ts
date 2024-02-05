import { DiscordListenerEntity } from "../entities/discord-listener.entity";

export class DiscordTextChannelListenerDTO {
  public readonly guildId: string;
  public readonly channelId: string;

  public constructor(guildId: string, channelId: string) {
    this.guildId = guildId;
    this.channelId = channelId;
  }

  public static fromEntity(entity: DiscordListenerEntity): DiscordTextChannelListenerDTO {
    return new DiscordTextChannelListenerDTO(entity.guildId, entity.channelId);
  }
}
