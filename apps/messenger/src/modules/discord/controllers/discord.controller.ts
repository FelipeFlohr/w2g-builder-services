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
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { DiscordGuildInfoDTO } from "../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../models/discord-guild.dto";
import { DiscordTextChannelDTO } from "../models/discord-text-channel.dto";

@ApiTags("Discord")
@ApiExtraModels(DiscordGuildInfoDTO, DiscordGuildDTO, DiscordTextChannelDTO)
@Controller("discord")
export class DiscordController {
  private readonly service: DiscordService;

  public constructor(@Inject(DiscordService) service: DiscordService) {
    this.service = service;
  }

  @Get("/guild")
  @ApiResponse({
    status: 200,
    schema: {
      items: {
        $ref: getSchemaPath(DiscordGuildInfoDTO),
      },
    },
  })
  public async getGuilds(@Query() query?: GetGuildsQueryDTO) {
    return await this.service.fetchGuilds(query);
  }

  @Get("/guild/:id")
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(DiscordGuildDTO),
    },
  })
  @ApiResponse({
    status: 404,
    description: "When the guild does not exist",
  })
  public async getGuild(@Param("id") id: string) {
    const res = await this.service.fetchGuildById(id);
    if (res) {
      return res;
    }
    throw new NotFoundException();
  }

  @Get("/channel/text/:guildId")
  @ApiResponse({
    status: 200,
    schema: {
      items: {
        $ref: getSchemaPath(DiscordTextChannelDTO),
      },
    },
  })
  public async getTextChannels(@Param("guildId") guildId: string) {
    return await this.service.fetchTextChannels(guildId);
  }

  @Get("/channel/text/:guildId/:channelId")
  @ApiResponse({
    status: 200,
    schema: {
      $ref: getSchemaPath(DiscordTextChannelDTO),
    },
  })
  public async getTextChannelById(
    @Param("guildId") guildId: string,
    @Param("channelId") channelId: string,
  ) {
    const channel = await this.service.fetchTextChannelById(guildId, channelId);
    if (channel) {
      return channel;
    }

    throw new NotFoundException();
  }
}
