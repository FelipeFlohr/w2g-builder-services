import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DiscordService } from "../discord.service";
import { DiscordClientService } from "../discord-client.service";
import { GuildFetchOptionsType } from "../../client/types/guild-fetch-options.type";
import { DiscordJsTextChannelImpl } from "../../client/business/impl/discord-js-text-channel.impl";
import { DiscordJsChannelImpl } from "../../client/business/impl/discord-js-channel.impl";
import { MessageFetchOptions } from "../../client/types/message-fetch-options.type";
import { DiscordGuild } from "../../client/business/discord-guild";
import { DiscordGuildInfo } from "../../client/business/discord-guild-info";
import { DiscordMessage } from "../../client/business/discord-message";
import { DiscordTextChannel } from "../../client/business/discord-text-channel";
import { DiscordTextChannelListenerDTO } from "../../models/discord-text-channel-listener.dto";
import { DiscordListenerRepository } from "../../repositories/discord-listener.repository";

@Injectable()
export class DiscordServiceImpl extends DiscordService {
  private readonly clientService: DiscordClientService;
  private readonly listenerRepository: DiscordListenerRepository;

  public constructor(
    @Inject(DiscordClientService) clientService: DiscordClientService,
    @Inject(DiscordListenerRepository)
    listenerRepository: DiscordListenerRepository,
  ) {
    super();
    this.clientService = clientService;
    this.listenerRepository = listenerRepository;
  }

  public async fetchGuilds(
    options?: GuildFetchOptionsType,
  ): Promise<DiscordGuildInfo[]> {
    return await this.clientService.client.fetchGuilds(options);
  }

  public async fetchGuildById(id: string): Promise<DiscordGuild | undefined> {
    return await this.clientService.client.fetchGuildById(id);
  }

  public async fetchTextChannels(
    guildId: string,
  ): Promise<DiscordTextChannel[]> {
    const guild = await this.clientService.client.fetchGuildById(guildId);
    if (guild) {
      const channels = await guild.fetchChannels();
      return channels
        .filter((channel) => channel.isTextChannel())
        .map((channel) =>
          DiscordJsTextChannelImpl.fromChannel(channel as DiscordJsChannelImpl),
        );
    }

    throw new NotFoundException();
  }

  public async fetchTextChannelById(
    guildId: string,
    channelId: string,
  ): Promise<DiscordTextChannel | undefined> {
    const guild = await this.fetchGuildById(guildId);
    if (guild) {
      const channel = await guild.fetchChannelById(channelId);
      if (channel?.isTextChannel()) {
        return DiscordJsTextChannelImpl.fromChannel(
          channel as DiscordJsChannelImpl,
        );
      }
    }
  }

  public async fetchChannelMessages(
    options: MessageFetchOptions,
  ): Promise<DiscordMessage[]> {
    const channel = await this.fetchTextChannelById(
      options.guildId,
      options.channelId,
    );

    if (channel) {
      return await channel.fetchMessages({
        after: options.after,
        amount: options.limit,
        around: options.around,
        before: options.before,
      });
    }
    return [];
  }

  public async addTextChannelListener(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<void> {
    return await this.listenerRepository.saveListener(listener);
  }

  public async listenerExists(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<boolean> {
    const res = await this.listenerRepository.findListenerByDTO(listener);
    return res != undefined;
  }

  public async deleteListener(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<void> {
    await this.listenerRepository.deleteListener(listener);
  }
}
