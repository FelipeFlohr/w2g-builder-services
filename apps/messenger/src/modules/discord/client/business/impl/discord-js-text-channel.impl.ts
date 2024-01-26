import { ChannelIsNotTextChannelError } from "src/modules/discord/errors/channel-is-not-text-channel.error";
import { DiscordTextChannel } from "../discord-text-channel";
import { DiscordJsTextChannelOptions } from "./types/discord-js-text-channel-options.type";
import { DiscordJsChannelImpl } from "./discord-js-channel.impl";
import { TypeUtils } from "src/utils/type-utils";
import { TextChannel } from "discord.js";
import { DiscordTextChannelDTO } from "src/modules/discord/models/discord-text-channel.dto";
import { DiscordParentCategory } from "../discord-parent-category";
import { DiscordJsParentCategoryImpl } from "./discord-js-parent-category.impl";
import { DiscordParentCategoryDTO } from "src/modules/discord/models/discord-parent-category.dto";
import { DiscordMessage } from "../discord-message";
import { DiscordJsMessageImpl } from "./discord-js-message.impl";
import { MessageFetchOptions } from "../types/message-fetch-options.type";
import { CollectionUtils } from "src/utils/collection-utils";
import { DiscordAPIErrorHandler } from "../handlers/discord-api-error.handler";
import { LoggerUtils } from "src/utils/logger-utils";

export class DiscordJsTextChannelImpl
  extends DiscordJsChannelImpl
  implements DiscordTextChannel
{
  public readonly lastMessageId?: string;
  public readonly parent?: DiscordParentCategory;
  public readonly rateLimitPerUser?: number;
  public override readonly channel: TextChannel;

  private static readonly logger = LoggerUtils.from(DiscordJsTextChannelImpl);

  public constructor(options: DiscordJsTextChannelOptions) {
    super(options);
    this.lastMessageId = options.lastMessageId;
    this.rateLimitPerUser = options.rateLimitPerUser;
    this.channel = options.channel;
    if (options.parent) {
      this.parent = new DiscordJsParentCategoryImpl(options.parent);
    }
  }

  public async fetchMessageById(
    id: string,
  ): Promise<DiscordMessage | undefined> {
    try {
      const message = await this.channel.messages.fetch(id);
      return DiscordJsMessageImpl.fromJsFetchedMessage(message);
    } catch (e) {
      DiscordAPIErrorHandler.handleDiscordJsErrors(
        e,
        DiscordJsTextChannelImpl.logger,
      );

      DiscordJsTextChannelImpl.logger.error(e);
      throw e;
    }
  }

  public async fetchMessages(
    options?: MessageFetchOptions,
  ): Promise<DiscordMessage[]> {
    return await CollectionUtils.fetchCollection<DiscordMessage>(
      {
        maxPossibleRecordsToFetch: 100,
        maxRecords: options?.amount,
      },
      async (amount, lastItem) => {
        const messages = await this.channel.messages.fetch({
          after: options?.after,
          around: options?.around,
          before: options?.before ?? lastItem?.id,
          cache: true,
          limit: amount,
        });
        return messages.map((item) =>
          DiscordJsMessageImpl.fromJsFetchedMessage(item),
        );
      },
    );
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
