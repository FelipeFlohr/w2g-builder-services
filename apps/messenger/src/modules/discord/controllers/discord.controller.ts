import { Controller, Delete, HttpCode, HttpStatus, Inject } from "@nestjs/common";
import { DiscordServiceProvider } from "../providers/discord-service.provider";
import { DiscordService } from "../services/discord.service";

@Controller("/discord")
export class DiscordController {
  private readonly service: DiscordService;

  public constructor(@Inject(DiscordServiceProvider) service: DiscordService) {
    this.service = service;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteAllSlashCommands() {
    await this.service.deleteAllSlashCommandsFromAllGuilds();
  }
}
