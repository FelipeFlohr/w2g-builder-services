import { DiscordJsSlashCommandImpl } from "../client/business/impl/discord-js-slash-command.impl";
import { DiscordSlashCommandInteraction } from "../client/business/discord-slash-command-interaction";
import { DiscordService } from "../services/discord.service";
import { DiscordJsSlashCommandParameterImpl } from "../client/business/impl/discord-js-slash-command-parameter.impl";
import { DiscordParameterTypeEnum } from "../client/business/types/discord-parameter-type.enum";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";
import { UnprocessableEntityException } from "@nestjs/common";
import { DiscordMessage } from "../client/business/discord-message";
import { MessageIsAlreadyDelimitationError } from "../errors/message-is-already-delimitation.error";

export class DelimitationMessageCommand extends DiscordJsSlashCommandImpl {
  private readonly service: DiscordService;

  private static readonly messageIdParameterName = "messageid";

  private static readonly messageIdParameter = new DiscordJsSlashCommandParameterImpl({
    name: DelimitationMessageCommand.messageIdParameterName,
    description: "ID of the message to mark as delimitation",
    required: true,
    type: DiscordParameterTypeEnum.STRING,
  });

  public constructor(service: DiscordService) {
    super({
      name: "markdelimitation",
      description: "Creates a delimitation on an already existing message",
      dmPermission: false,
      parameters: [DelimitationMessageCommand.messageIdParameter],
    });
    this.service = service;
  }

  public async onInteraction(interaction: DiscordSlashCommandInteraction): Promise<void> {
    if (interaction.guildId) {
      const listener = new DiscordTextChannelListenerDTO(interaction.guildId, interaction.channelId);

      if (await this.service.listenerExists(listener)) {
        const messageId = interaction.data[DelimitationMessageCommand.messageIdParameterName] as string;
        const message = await this.getMessageByMessageId(interaction.guildId, interaction.channelId, messageId);

        if (message == undefined) {
          await interaction.reply("No message found with given ID.");
        } else {
          try {
            await this.service.saveDelimitationMessage(message);
            await interaction.reply("Created delimitation message.");
          } catch (e) {
            if (e instanceof MessageIsAlreadyDelimitationError) {
              await interaction.reply(e.message);
            } else {
              throw e;
            }
          }
        }
      } else {
        await interaction.reply("No listener was found.");
      }
    } else {
      await this.guildDoesNotExistsInteraction(interaction);
    }
  }

  private async getMessageByMessageId(
    guildId: string,
    channelId: string,
    messageId: string,
  ): Promise<DiscordMessage | undefined> {
    try {
      return await this.service.fetchMessageById(guildId, channelId, messageId);
    } catch (e) {
      if (e instanceof UnprocessableEntityException) {
        return;
      }
      throw e;
    }
  }
}
