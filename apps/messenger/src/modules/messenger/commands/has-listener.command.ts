import { DiscordGuildSlashCommandInteractionDTO } from "src/modules/discord/models/discord-guild-slash-command-interaction.dto";
import { DiscordGuildSlashCommandDTO } from "src/modules/discord/models/discord-guild-slash-command.dto";
import { MessengerService } from "../services/messenger.service";

export class HasListenerCommand extends DiscordGuildSlashCommandDTO {
  private readonly service: MessengerService;

  public constructor(service: MessengerService) {
    super({
      name: "haslistener",
      description: "Returns a message saying if there is an active listener on this channel",
      dmPermission: false,
    });
    this.service = service;
  }

  public async onGuildInteraction(interaction: DiscordGuildSlashCommandInteractionDTO): Promise<string> {
    if (await this.service.listenerExistsByChannelIdAndGuildId(interaction.channelId, interaction.guildId)) {
      return "Listener found in this channel.";
    }
    return "No listener was found.";
  }
}
