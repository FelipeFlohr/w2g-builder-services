import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { DiscordGuildInfoDTO } from "../../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../../models/discord-guild.dto";
import { DiscordMessageDTO } from "../../models/discord-message.dto";
import { DiscordTextChannelDTO } from "../../models/discord-text-channel.dto";
import { GetGuildsQueryDTO } from "../../models/get-guilds-query.dto";
import { DiscordController } from "../discord.controller";
import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { DiscordService } from "../../services/discord.service";
import { GetMessagesQueryDTO } from "../../models/get-messages-query.dto";

@ApiTags("Discord")
@ApiExtraModels(
  DiscordGuildInfoDTO,
  DiscordGuildDTO,
  DiscordTextChannelDTO,
  DiscordMessageDTO,
)
@Controller("discord")
export class DiscordControllerImpl implements DiscordController {
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
  public async getGuilds(
    @Query() query?: GetGuildsQueryDTO | undefined,
  ): Promise<DiscordGuildInfoDTO[]> {
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
  public async getGuild(@Param("id") id: string): Promise<DiscordGuildDTO> {
    const res = await this.service.fetchGuildById(id);
    if (res) {
      return res.toDTO();
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
  public async getTextChannels(
    @Param("guildId") guildId: string,
  ): Promise<DiscordTextChannelDTO[]> {
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
  ): Promise<DiscordTextChannelDTO> {
    const channel = await this.service.fetchTextChannelById(guildId, channelId);
    if (channel) {
      return channel;
    }
    throw new NotFoundException();
  }

  @Get("/message/:guildId/:channelId")
  @ApiResponse({
    status: 200,
    schema: {
      items: {
        $ref: getSchemaPath(DiscordMessageDTO),
      },
    },
  })
  public async getMessagesFromTextChannel(
    @Param("guildId") guildId: string,
    @Param("channelId") channelId: string,
    @Query() options?: GetMessagesQueryDTO,
  ): Promise<DiscordMessageDTO[]> {
    const messages = await this.service.fetchChannelMessages({
      channelId: channelId,
      guildId: guildId,
      after: options?.after,
      around: options?.around,
      before: options?.before,
      limit: options?.limit,
    });
    return messages.map((message) => message.toDTO());
  }
}
