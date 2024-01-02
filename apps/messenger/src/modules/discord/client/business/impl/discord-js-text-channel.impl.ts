import { ChannelIsNotTextChannelError } from "src/modules/discord/errors/channel-is-not-text-channel.error";
import { DiscordTextChannel } from "../discord-text-channel";
import { DiscordJsTextChannelOptions } from "../types/discord-js-text-channel-options.type";
import { DiscordJsChannelImpl } from "./discord-js-channel.impl";
import { TypeUtils } from "src/utils/type-utils";
import { TextChannel } from "discord.js";

export class DiscordJsTextChannelImpl
  extends DiscordJsChannelImpl
  implements DiscordTextChannel
{
  public readonly lastMessageId?: string;
  public readonly parentId?: string;
  public readonly rateLimitPerUser?: number;

  public constructor(options: DiscordJsTextChannelOptions) {
    super(options);
    this.lastMessageId = options.lastMessageId;
    this.parentId = options.parentId;
    this.rateLimitPerUser = options.rateLimitPerUser;
  }

  public static fromChannel(channel: DiscordJsChannelImpl) {
    if (channel.isTextChannel() && channel.channel instanceof TextChannel) {
      return new DiscordJsTextChannelImpl({
        channel: channel.channel,
        createdAt: channel.createdAt,
        id: channel.id,
        manageable: channel.manageable,
        name: channel.name,
        url: channel.url,
        viewable: channel.viewable,
        lastMessageId: TypeUtils.parseNullToUndefined(
          channel.channel.lastMessageId,
        ),
        parentId: TypeUtils.parseNullToUndefined(channel.channel.parentId),
        rateLimitPerUser: channel.channel.rateLimitPerUser,
      });
    }
    throw new ChannelIsNotTextChannelError(channel);
  }
}
