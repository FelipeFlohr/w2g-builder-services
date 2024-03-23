import { DiscordGuildSlashCommandInteractionDTO } from "src/modules/discord/models/discord-guild-slash-command-interaction.dto";
import { DiscordGuildSlashCommandDTO } from "src/modules/discord/models/discord-guild-slash-command.dto";
import { MessengerService } from "../services/messenger.service";

export class GetDelimitationMessageCommand extends DiscordGuildSlashCommandDTO {
  private readonly service: MessengerService;

  public constructor(service: MessengerService) {
    super({
      name: "haslistener",
      description: "Returns a message telling if there is an active listener on this channel",
      dmPermission: false,
    });
    this.service = service;
  }

  public async onGuildInteraction(interaction: DiscordGuildSlashCommandInteractionDTO): Promise<string> {
    const url = await this.service.getDelimitationMessageUrlByChannelIdAndGuildId(
      interaction.channelId,
      interaction.guildId,
    );
    return url ?? "No delimitation message found on this channel.";
  }
}
