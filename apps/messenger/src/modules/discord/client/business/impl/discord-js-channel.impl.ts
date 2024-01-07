import {
  Channel,
  GuildBasedChannel,
  NonThreadGuildBasedChannel,
  TextChannel,
} from "discord.js";
import { DiscordChannel } from "../discord-channel";
import { DiscordJsChannelOptions } from "../types/discord-js-channel-options.type";
import { DiscordChannelDTO } from "src/modules/discord/models/discord-channel.dto";

export class DiscordJsChannelImpl implements DiscordChannel {
  public readonly createdAt: Date;
  public readonly id: string;
  public readonly manageable: boolean;
  public readonly name: string;
  public readonly url: string;
  public readonly viewable: boolean;
  public readonly channel: Channel;

  public constructor(options: DiscordJsChannelOptions) {
    this.createdAt = options.createdAt;
    this.id = options.id;
    this.manageable = options.manageable;
    this.name = options.name;
    this.url = options.url;
    this.viewable = options.viewable;
    this.channel = options.channel;
  }

  public static fromJsChannel(
    channel: NonThreadGuildBasedChannel | GuildBasedChannel,
  ): DiscordJsChannelImpl {
    return new DiscordJsChannelImpl({
      channel: channel,
      createdAt: channel.createdAt ?? new Date(),
      id: channel.id,
      manageable: channel.manageable,
      name: channel.name,
      url: channel.url,
      viewable: channel.viewable,
    });
  }

  public isTextChannel(): boolean {
    return this.channel.isTextBased() && this.channel instanceof TextChannel;
  }

  public toDTO(): DiscordChannelDTO {
    return new DiscordChannelDTO({
      createdAt: this.createdAt,
      id: this.id,
      manageable: this.manageable,
      name: this.name,
      url: this.url,
      viewable: this.viewable,
    });
  }
}
