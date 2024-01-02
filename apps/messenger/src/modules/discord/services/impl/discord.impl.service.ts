import { Inject, Injectable } from "@nestjs/common";
import { DiscordService } from "../discord.service";
import { DiscordClientService } from "../discord-client.service";
import { GuildFetchOptionsType } from "../../client/types/guild-fetch-options.type";
import { DiscordGuildInfoDTO } from "../../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../../models/discord-guild.dto";

@Injectable()
export class DiscordServiceImpl implements DiscordService {
  private readonly clientService: DiscordClientService;

  public constructor(
    @Inject(DiscordClientService) clientService: DiscordClientService,
  ) {
    this.clientService = clientService;
  }

  public async fetchGuilds(
    options?: GuildFetchOptionsType,
  ): Promise<DiscordGuildInfoDTO[]> {
    const guilds = await this.clientService.client.fetchGuilds(options);
    return guilds.map((guild) => guild.toDTO());
  }

  public async fetchGuildById(
    id: string,
  ): Promise<DiscordGuildDTO | undefined> {
    const guild = await this.clientService.client.fetchGuildById(id);
    return guild?.toDTO();
  }
}
