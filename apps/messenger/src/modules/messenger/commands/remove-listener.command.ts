import { DiscordGuildSlashCommandInteractionDTO } from "src/modules/discord/models/discord-guild-slash-command-interaction.dto";
import { DiscordGuildSlashCommandDTO } from "src/modules/discord/models/discord-guild-slash-command.dto";
import { MessengerService } from "../services/messenger.service";

export class RemoveListenerCommand extends DiscordGuildSlashCommandDTO {
  private readonly service: MessengerService;

  public constructor(service: MessengerService) {
    super({
      name: "removelistener",
      description: "Remove the listener from this channel",
      dmPermission: false,
    });
    this.service = service;
  }

  public async onGuildInteraction(interaction: DiscordGuildSlashCommandInteractionDTO): Promise<string> {
    const listenerExists = await this.service.listenerExistsByChannelIdAndGuildId(
      interaction.channelId,
      interaction.guildId,
    );
    if (listenerExists) {
      await this.service.deleteListenerByChannelIdAndGuildId(interaction.channelId, interaction.guildId);
    }
    return "Listener does not exist on this channel.";
  }
}
