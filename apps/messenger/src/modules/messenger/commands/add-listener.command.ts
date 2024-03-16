import { DiscordSlashCommandInteractionDTO } from "src/modules/discord/models/discord-slash-command-interaction.dto";
import { DiscordSlashCommandDTO } from "src/modules/discord/models/discord-slash-command.dto";

export class AddListenerCommand extends DiscordSlashCommandDTO {
  public constructor() {
    super({
      name: "addlistener",
      description: "Listen to messages in this channel",
      dmPermission: false,
    });
  }

  public async onInteraction(interaction: DiscordSlashCommandInteractionDTO): Promise<string | undefined> {
    throw new Error("Method not implemented.");
  }
}
