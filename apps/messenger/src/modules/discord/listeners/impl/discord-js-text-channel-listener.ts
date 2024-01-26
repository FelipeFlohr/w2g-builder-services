import { DiscordAMQPService } from "../../amqp/discord-amqp.service";
import { DiscordMessage } from "../../client/business/discord-message";
import { DiscordTextChannelListenerDTO } from "../../models/discord-text-channel-listener.dto";
import { DiscordService } from "../../services/discord.service";
import { DiscordTextChannelListener } from "../discord-text-channel-listener";

export class DiscordJsTextChannelListener
  implements DiscordTextChannelListener
{
  private readonly service: DiscordService;
  private readonly amqp: DiscordAMQPService;

  public constructor(service: DiscordService, amqp: DiscordAMQPService) {
    this.service = service;
    this.amqp = amqp;
  }

  public async onMessageCreated(message: DiscordMessage): Promise<void> {
    if (await this.listenerExists(message)) {
      const messageFetched = await message.fetch();
      await this.amqp.sendCreatedMessage(messageFetched.toDTO());
    }
  }

  public async onMessageDeleted(message: DiscordMessage): Promise<void> {
    if (await this.listenerExists(message)) {
      const messageFetched = await message.fetch();
      await this.amqp.sendDeletedMessage(messageFetched.toDTO());
    }
  }

  public async onMessageEdited(message: DiscordMessage): Promise<void> {
    // throw new Error("Method not implemented.");
  }

  private async listenerExists(message: DiscordMessage): Promise<boolean> {
    const listener = new DiscordTextChannelListenerDTO(
      message.guildId,
      message.channelId,
    );
    return await this.service.listenerExists(listener);
  }
}
