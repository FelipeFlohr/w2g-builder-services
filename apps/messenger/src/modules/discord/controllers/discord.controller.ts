import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { GetGuildsQueryDTO } from "../models/get-guilds-query.dto";
import { DiscordService } from "../services/discord.service";

@Controller("discord")
export class DiscordController {
  private readonly service: DiscordService;

  public constructor(@Inject(DiscordService) service: DiscordService) {
    this.service = service;
  }

  @Get("/guild")
  public async getGuilds(@Query() query?: GetGuildsQueryDTO) {
    return await this.service.fetchGuilds(query);
  }

  @Get("/guild/:id")
  public async getGuild(@Param("id") id: string) {
    const res = await this.service.fetchGuildById(id);
    if (res) {
      return res;
    }
    throw new NotFoundException();
  }
}
