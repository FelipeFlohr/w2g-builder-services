import { DiscordMessage } from "../../client/business/discord-message";
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
    if (await this.service.listenerExists(message.channelId, message.guildId)) {
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
