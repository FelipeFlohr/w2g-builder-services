import { DiscordGuildSlashCommandInteractionDTO } from "src/modules/discord/models/discord-guild-slash-command-interaction.dto";
import { DiscordGuildSlashCommandDTO } from "src/modules/discord/models/discord-guild-slash-command.dto";
import { MessengerService } from "../services/messenger.service";

export class AddListenerCommand extends DiscordGuildSlashCommandDTO {
  private readonly service: MessengerService;

  public constructor(service: MessengerService) {
    super({
      name: "addlistener",
      description: "Listen to messages in this channel",
      dmPermission: false,
    });
    this.service = service;
  }

  public async onGuildInteraction(interaction: DiscordGuildSlashCommandInteractionDTO): Promise<string> {
    if (await this.service.listenerExistsByChannelIdAndGuildId(interaction.channelId, interaction.guildId)) {
      return "Listener already exists on this channel.";
    }
    await this.service.saveListenerByChannelIdAndGuildId(interaction.channelId, interaction.guildId);
    return "Listener created.";
  }
}
