import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DiscordService } from "../discord.service";
import { DiscordClientService } from "../discord-client.service";
import { GuildFetchOptionsType } from "../../client/types/guild-fetch-options.type";
import { DiscordGuildInfoDTO } from "../../models/discord-guild-info.dto";
import { DiscordGuildDTO } from "../../models/discord-guild.dto";
import { DiscordTextChannelDTO } from "../../models/discord-text-channel.dto";
import { DiscordJsTextChannelImpl } from "../../client/business/impl/discord-js-text-channel.impl";
import { DiscordJsChannelImpl } from "../../client/business/impl/discord-js-channel.impl";

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

  public async fetchTextChannels(
    guildId: string,
  ): Promise<DiscordTextChannelDTO[]> {
    const guild = await this.clientService.client.fetchGuildById(guildId);
    if (guild) {
      const channels = await guild.fetchChannels();
      return channels
        .filter((channel) => channel.isTextChannel())
        .map((channel) =>
          DiscordJsTextChannelImpl.fromChannel(channel as DiscordJsChannelImpl),
        )
        .map((textChannel) => textChannel.toDTO());
    }

    throw new NotFoundException();
  }

  public async fetchTextChannelById(
    guildId: string,
    channelId: string,
  ): Promise<DiscordTextChannelDTO | undefined> {
    const guild = await this.clientService.client.fetchGuildById(guildId);
    if (guild) {
      const channel = await guild.fetchChannelById(channelId);
      if (channel?.isTextChannel()) {
        const textChannel = DiscordJsTextChannelImpl.fromChannel(
          channel as DiscordJsChannelImpl,
        );
        return textChannel.toDTO();
      }
    }
  }
}
