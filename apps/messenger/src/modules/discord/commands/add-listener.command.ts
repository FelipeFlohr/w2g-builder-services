import { DiscordSlashCommandInteraction } from "../client/business/discord-slash-command-interaction";
import { DiscordJsSlashCommandImpl } from "../client/business/impl/discord-js-slash-command.impl";
import { DiscordTextChannelListenerDTO } from "../models/discord-text-channel-listener.dto";
import { DiscordService } from "../services/discord.service";

export class AddListenerCommand extends DiscordJsSlashCommandImpl {
  private readonly service: DiscordService;

  public constructor(service: DiscordService) {
    super("addListener", "Listen to messages in this channel", false);
    this.service = service;
  }

  public async onInteraction(
    interaction: DiscordSlashCommandInteraction,
  ): Promise<void> {
    if (interaction.guildId) {
      const dto = new DiscordTextChannelListenerDTO(
        interaction.guildId,
        interaction.channelId,
      );
      await this.service.addTextChannelListener(dto);
      await interaction.reply("Listener added");
    }
    return await interaction.reply("Guild not found");
  }
}
