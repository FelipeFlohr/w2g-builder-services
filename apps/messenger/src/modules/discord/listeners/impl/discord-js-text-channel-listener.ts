import { DiscordMessage } from "../../client/business/discord-message";
import { DiscordTextChannelListenerDTO } from "../../models/discord-text-channel-listener.dto";
import { DiscordService } from "../../services/discord.service";
import { DiscordTextChannelListener } from "../discord-text-channel-listener";

export class DiscordJsTextChannelListener
  implements DiscordTextChannelListener
{
  private readonly service: DiscordService;

  public constructor(service: DiscordService) {
    this.service = service;
  }

  public async onMessageCreated(message: DiscordMessage): Promise<void> {
    const listener = new DiscordTextChannelListenerDTO(
      message.guildId,
      message.guildId,
    );

    if (await this.service.listenerExists(listener)) {
      await message.fetch();
    }
    // throw new Error("Method not implemented.");
  }

  public async onMessageDeleted(message: DiscordMessage): Promise<void> {
    // throw new Error("Method not implemented.");
  }

  public async onMessageEdited(message: DiscordMessage): Promise<void> {
    // throw new Error("Method not implemented.");
  }
}
