import { DiscordParameterTypeEnum } from "src/modules/discord/enums/discord-parameter-type.enum";
import { DiscordGuildSlashCommandInteractionDTO } from "src/modules/discord/models/discord-guild-slash-command-interaction.dto";
import { DiscordGuildSlashCommandDTO } from "src/modules/discord/models/discord-guild-slash-command.dto";
import { DiscordSlashCommandParameterDTO } from "src/modules/discord/models/discord-slash-command-parameter.dto";
import { MessengerService } from "../services/messenger.service";

export class MarkDelimitationCommand extends DiscordGuildSlashCommandDTO {
  private readonly service: MessengerService;

  private static readonly messageIdParameterName = "messageid";

  private static readonly messageIdParameter = new DiscordSlashCommandParameterDTO({
    name: MarkDelimitationCommand.messageIdParameterName,
    description: "ID of the message to mark as delimitation",
    required: true,
    type: DiscordParameterTypeEnum.STRING,
  });

  public constructor(service: MessengerService) {
    super({
      name: "markdelimitation",
      description: "Creates a delimitation on an already existing message",
      dmPermission: false,
      parameters: [MarkDelimitationCommand.messageIdParameter],
    });
    this.service = service;
  }

  public async onGuildInteraction(interaction: DiscordGuildSlashCommandInteractionDTO): Promise<string> {
    const messageId = interaction.data[MarkDelimitationCommand.messageIdParameterName] as string | undefined;
    if (messageId == undefined) {
      return "No message ID found.";
    }

    const listenerExists = await this.service.listenerExistsByChannelIdAndGuildId(
      interaction.channelId,
      interaction.guildId,
    );
    if (!listenerExists) {
      await this.service.saveListenerByChannelIdAndGuildId(interaction.channelId, interaction.guildId);
    }

    await this.service.saveDelimitationMessageByMessageIdAndChannelIdAndGuildId(
      messageId,
      interaction.channelId,
      interaction.guildId,
    );
    if (listenerExists) {
      return "Created delimitation message.";
    }
    return "Created listener and delimitation message.";
  }
}
