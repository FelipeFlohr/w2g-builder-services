import { DiscordSlashCommandInteraction } from "../client/business/discord-slash-command-interaction";
import { DiscordJsSlashCommandImpl } from "../client/business/impl/discord-js-slash-command.impl";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";
import { DiscordService } from "../services/discord.service";

export class HasListenerCommand extends DiscordJsSlashCommandImpl {
  private readonly service: DiscordService;

  public constructor(service: DiscordService) {
    super(
      "haslistener",
      "Returns a message saying if there is an active listener on this channel",
      false,
    );
    this.service = service;
  }

  public async onInteraction(
    interaction: DiscordSlashCommandInteraction,
  ): Promise<void> {
    if (interaction.guildId) {
      const listener = new DiscordTextChannelListenerDTO(
        interaction.guildId,
        interaction.channelId,
      );

      if (await this.service.listenerExists(listener)) {
        await interaction.reply("Listener found in this channel.");
      } else {
        await interaction.reply("No listener was found.");
      }
    } else {
      await this.guildDoesNotExistsInteraction(interaction);
    }
  }
}
