import { DiscordSlashCommandInteraction } from "../client/business/discord-slash-command-interaction";
import { DiscordJsSlashCommandImpl } from "../client/business/impl/discord-js-slash-command.impl";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";
import { DiscordService } from "../services/discord.service";

export class RemoveListenerCommand extends DiscordJsSlashCommandImpl {
  private readonly service: DiscordService;

  public constructor(service: DiscordService) {
    super("removelistener", "Removes the listener from this channel", false);
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
        await this.service.deleteListener(listener);
        await interaction.reply("Deleted listener from channel");
      } else {
        await interaction.reply("No listener was found.");
      }
    } else {
      await this.guildDoesNotExistsInteraction(interaction);
    }
  }
}
