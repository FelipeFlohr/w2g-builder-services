import { Guild, NonThreadGuildBasedChannel } from "discord.js";
import { DiscordGuild } from "../discord-guild";
import { DiscordJsGuildOptions } from "../types/discord-js-guild-options.type";
import { DiscordChannel } from "../discord-channel";
import { DiscordJsChannelImpl } from "./discord-js-channel.impl";
import { DiscordGuildDTO } from "src/modules/discord/models/discord-guild.dto";

export class DiscordJsGuildImpl implements DiscordGuild {
  public readonly applicationId?: string;
  public readonly memberCount: number;
  public readonly available: boolean;
  public readonly createdAt: Date;
  public readonly id: string;
  public readonly joinedAt: Date;
  public readonly ownerId: string;
  public readonly name: string;
  public readonly large: boolean;
  private readonly guild: Guild;

  public constructor(options: DiscordJsGuildOptions) {
    this.applicationId = options.applicationId;
    this.memberCount = options.memberCount;
    this.available = options.avaiable;
    this.createdAt = options.createdAt;
    this.id = options.id;
    this.joinedAt = options.joinedAt;
    this.ownerId = options.ownerId;
    this.name = options.name;
    this.large = options.large;
    this.guild = options.guild;
  }

  public static fromGuild(guild: Guild): DiscordJsGuildImpl {
    return new DiscordJsGuildImpl({
      avaiable: guild.available,
      createdAt: guild.createdAt,
      id: guild.id,
      joinedAt: guild.joinedAt,
      large: guild.large,
      memberCount: guild.memberCount,
      name: guild.name,
      ownerId: guild.ownerId,
      applicationId: guild.ownerId,
      guild: guild,
    });
  }

  public async fetchChannels(): Promise<DiscordChannel[]> {
    const guilds = await this.guild.channels.fetch();
    return guilds
      .filter((guild) => guild != null)
      .map((guild) =>
        DiscordJsChannelImpl.fromJsChannel(guild as NonThreadGuildBasedChannel),
      );
  }

  public async fetchChannelById(
    id: string,
  ): Promise<DiscordChannel | undefined> {
    const guild = await this.guild.channels.fetch(id);
    if (guild) {
      return DiscordJsChannelImpl.fromJsChannel(guild);
    }
  }

  public toDTO(): DiscordGuildDTO {
    return new DiscordGuildDTO({
      available: this.available,
      createdAt: this.createdAt,
      id: this.id,
      joinedAt: this.joinedAt,
      large: this.large,
      memberCount: this.memberCount,
      name: this.name,
      ownerId: this.ownerId,
      applicationId: this.applicationId,
    });
  }
}
