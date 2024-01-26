import { DiscordSlashCommandInteraction } from "../client/business/discord-slash-command-interaction";
import { DiscordJsSlashCommandImpl } from "../client/business/impl/discord-js-slash-command.impl";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";
import { DiscordService } from "../services/discord.service";

export class AddListenerCommand extends DiscordJsSlashCommandImpl {
  private readonly service: DiscordService;

  public constructor(service: DiscordService) {
    super({
      name: "addlistener",
      description: "Listen to messages in this channel",
      dmPermission: false,
    });
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
        await interaction.reply("Listener already exists on this channel.");
      } else {
        await this.service.addTextChannelListener(listener);
        await interaction.reply("Listener added to channel.");
      }
    } else {
      await this.guildDoesNotExistsInteraction(interaction);
    }
  }
}
