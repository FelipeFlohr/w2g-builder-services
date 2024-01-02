import {
  Channel,
  GuildBasedChannel,
  NonThreadGuildBasedChannel,
} from "discord.js";
import { DiscordChannel } from "../discord-channel";
import { DiscordJsChannelOptions } from "../types/discord-js-channel-options.type";

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
    return this.channel.isTextBased();
  }
}
