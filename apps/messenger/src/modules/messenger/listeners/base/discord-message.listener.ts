import { DiscordMessageDTO } from "src/models/discord-message.dto";
import { IMessageListener } from "src/modules/discord/interfaces/message-listener.interface";
import { MessengerService } from "../../services/messenger.service";

export abstract class DiscordMessageListener implements IMessageListener {
  protected readonly service: MessengerService;

  public constructor(service: MessengerService) {
    this.service = service;
  }

  public async validateBeforeFetching(message: DiscordMessageDTO): Promise<boolean> {
    return await this.service.listenerExistsByChannelIdAndGuildId(message.channelId, message.guildId);
  }

  public abstract onMessage(message: DiscordMessageDTO): Promise<void>;
}
