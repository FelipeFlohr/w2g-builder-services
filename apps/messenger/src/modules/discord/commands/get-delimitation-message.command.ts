import { StringUtils } from "src/utils/string-utils";
import { DiscordSlashCommandInteraction } from "../client/business/discord-slash-command-interaction";
import { DiscordJsSlashCommandImpl } from "../client/business/impl/discord-js-slash-command.impl";
import { DiscordService } from "../services/discord.service";

export class GetDelimitationMessageCommand extends DiscordJsSlashCommandImpl {
  private readonly service: DiscordService;

  public constructor(service: DiscordService) {
    super({
      name: "getdelimitationmessage",
      description: "Retrieves the link of the delimitation message",
      dmPermission: false,
    });
    this.service = service;
  }

  public async onInteraction(interaction: DiscordSlashCommandInteraction): Promise<void> {
    if (interaction.guildId) {
      const url = await this.service.getDelimitationMessageLinkByGuildAndChannelId(
        interaction.guildId,
        interaction.channelId,
      );

      if (StringUtils.isNotBlank(url)) {
        await interaction.reply(url);
      } else {
        await interaction.reply("No delimitation message found on this channel.");
      }
    } else {
      await this.guildDoesNotExistsInteraction(interaction);
    }
  }
}
