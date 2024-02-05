import { LoggedDiscordClient } from "../logged-discord-client";
import { DiscordJsClientImpl } from "./discord-js-client.impl";
import { GuildFetchOptionsType } from "../types/guild-fetch-options.type";
import { DiscordGuildInfo } from "../business/discord-guild-info";
import { DiscordGuild } from "../business/discord-guild";
import { DiscordJsGuildImpl } from "../business/impl/discord-js-guild.impl";
import { DiscordClient } from "../discord-client";
import { CollectionUtils } from "src/utils/collection-utils";
import { DiscordJsGuildInfoImpl } from "../business/impl/discord-js-guild-info.impl";
import { DiscordAPIError } from "discord.js";
import { DiscordErrorCodeEnum } from "src/utils/discord-error-code.enum";
import { DiscordAPIErrorHandler } from "../business/handlers/discord-api-error.handler";
import { LoggerUtils } from "src/utils/logger-utils";

export class LoggedDiscordJsClientImpl extends DiscordJsClientImpl implements LoggedDiscordClient {
  private static readonly logger = LoggerUtils.from(LoggedDiscordJsClientImpl);
  private static readonly MAX_GUILD_FETCH = 200;

  public static async fromClient(client: DiscordClient): Promise<LoggedDiscordClient> {
    const jsClient = await (client as DiscordJsClientImpl).getClientAsTrue();
    return new LoggedDiscordJsClientImpl(jsClient);
  }

  public async fetchGuilds(options?: GuildFetchOptionsType): Promise<Array<DiscordGuildInfo>> {
    return await CollectionUtils.fetchCollection(
      {
        maxPossibleRecordsToFetch: LoggedDiscordJsClientImpl.MAX_GUILD_FETCH,
        maxRecords: options?.limit,
      },
      async (amount, lastItemFetched) => {
        const res = await this.client.guilds.fetch({
          after: options?.after,
          before: options?.before ?? lastItemFetched?.id,
          limit: amount,
        });
        return res.map((val) => DiscordJsGuildInfoImpl.fromOAuth2Guild(val));
      },
    );
  }

  public async fetchGuildById(id: string): Promise<DiscordGuild | undefined> {
    try {
      const guild = await this.client.guilds.fetch(id);
      return DiscordJsGuildImpl.fromGuild(guild);
    } catch (e) {
      if (e instanceof DiscordAPIError && e.code === DiscordErrorCodeEnum.UNKNOWN_GUILD) {
        LoggedDiscordJsClientImpl.logger.error(e);
        return;
      }
      DiscordAPIErrorHandler.handleDiscordJsErrors(e, LoggedDiscordJsClientImpl.logger);

      throw e;
    }
  }
}
