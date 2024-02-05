import { InternalServerErrorException } from "@nestjs/common";
import { DiscordChannel } from "../client/business/discord-channel";
import { DiscordJsChannelImpl } from "../client/business/impl/discord-js-channel.impl";

export class ChannelIsNotTextChannelError extends InternalServerErrorException {
  public constructor(channel: DiscordChannel | DiscordJsChannelImpl) {
    super(ChannelIsNotTextChannelError.getMessage(channel));
  }

  private static getMessage(channel: DiscordChannel | DiscordJsChannelImpl): string {
    if (channel instanceof DiscordJsChannelImpl) {
      return `Channel is not text channel. Object: ${channel.channel}`;
    }
    return "Channel is not text channel.";
  }
}
