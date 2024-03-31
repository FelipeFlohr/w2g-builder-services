import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from "@nestjs/common";
import { GuildWithChannelIdsDTO } from "../models/guild-with-channel-ids.dto";
import { MessengerServiceProvider } from "../providers/messenger-service.provider";
import { MessengerService } from "../services/messenger.service";

@Controller("/messenger")
export class MessengerController {
  private readonly service: MessengerService;

  public constructor(@Inject(MessengerServiceProvider) service: MessengerService) {
    this.service = service;
  }

  @Post("/command")
  @HttpCode(HttpStatus.NO_CONTENT)
  public async setupCommands() {
    await this.service.setupSlashCommands();
  }

  @Post("/guildimages")
  public async guildImages(@Body() guildIds: Array<string>) {
    if (Array.isArray(guildIds) && guildIds.every((i) => typeof i === "string")) {
      return await this.service.getGuildsWithImageLink(guildIds);
    }
    return [];
  }

  @Post("/channelnames")
  public async channelNames(@Body() guildWithChannels: GuildWithChannelIdsDTO) {
    return await this.service.getChannelNames(guildWithChannels);
  }
}
