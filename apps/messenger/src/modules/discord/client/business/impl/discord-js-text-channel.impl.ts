import { ChannelIsNotTextChannelError } from "src/modules/discord/errors/channel-is-not-text-channel.error";
import { DiscordTextChannel } from "../discord-text-channel";
import { DiscordJsTextChannelOptions } from "../types/discord-js-text-channel-options.type";
import { DiscordJsChannelImpl } from "./discord-js-channel.impl";
import { TypeUtils } from "src/utils/type-utils";
import { TextChannel } from "discord.js";
import { DiscordTextChannelDTO } from "src/modules/discord/models/discord-text-channel.dto";
import { DiscordParentCategory } from "../discord-parent-category";
import { DiscordJsParentCategoryImpl } from "./discord-js-parent-category.impl";
import { DiscordParentCategoryDTO } from "src/modules/discord/models/discord-parent-category.dto";

export class DiscordJsTextChannelImpl
  extends DiscordJsChannelImpl
  implements DiscordTextChannel
{
  public readonly lastMessageId?: string;
  public readonly parent?: DiscordParentCategory;
  public readonly rateLimitPerUser?: number;

  public constructor(options: DiscordJsTextChannelOptions) {
    super(options);
    this.lastMessageId = options.lastMessageId;
    this.rateLimitPerUser = options.rateLimitPerUser;
    if (options.parent) {
      this.parent = new DiscordJsParentCategoryImpl(options.parent);
    }
  }

  public override toDTO(): DiscordTextChannelDTO {
    const parent =
      this.parent != undefined
        ? new DiscordParentCategoryDTO({
            id: this.parent.id,
            name: this.parent.name,
          })
        : undefined;

    return new DiscordTextChannelDTO({
      createdAt: this.createdAt,
      id: this.id,
      manageable: this.manageable,
      name: this.name,
      url: this.url,
      viewable: this.viewable,
      lastMessageId: this.lastMessageId,
      rateLimitPerUser: this.rateLimitPerUser,
      parent: parent,
    });
  }

  public static fromChannel(channel: DiscordJsChannelImpl) {
    if (channel.isTextChannel() && channel.channel instanceof TextChannel) {
      const parentCategory =
        channel.channel.parent != undefined
          ? new DiscordJsParentCategoryImpl({
              id: channel.channel.parent.id,
              name: channel.channel.parent.name,
            })
          : undefined;

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
        parent: parentCategory,
        rateLimitPerUser: channel.channel.rateLimitPerUser,
      });
    }
    throw new ChannelIsNotTextChannelError(channel);
  }
}
