import { LoggedDiscordClient } from "../logged-discord-client";
import { DiscordJsClientImpl } from "./discord-js-client.impl";
import { GuildFetchOptionsType } from "../types/guild-fetch-options.type";
import { DiscordGuildInfo } from "../business/discord-guild-info";
import { DiscordGuild } from "../business/discord-guild";
import { DiscordJsGuildImpl } from "../business/impl/discord-js-guild.impl";
import { Logger } from "@nestjs/common";
import { DiscordClient } from "../discord-client";
import { CollectionUtils } from "src/utils/collection-utils";
import { DiscordJsGuildInfoImpl } from "../business/impl/discord-js-guild-info.impl";

export class LoggedDiscordJsClientImpl
  extends DiscordJsClientImpl
  implements LoggedDiscordClient
{
  private static readonly MAX_GUILD_FETCH = 200;

  public static async fromClient(
    client: DiscordClient,
  ): Promise<LoggedDiscordClient> {
    const jsClient = await (client as DiscordJsClientImpl).getClientAsTrue();
    return new LoggedDiscordJsClientImpl(jsClient);
  }

  public async fetchGuilds(
    options?: GuildFetchOptionsType,
  ): Promise<Array<DiscordGuildInfo>> {
    return await CollectionUtils.fetchCollection(
      {
        maxPossibleRecordsToFetch: LoggedDiscordJsClientImpl.MAX_GUILD_FETCH,
        maxRecords: options?.limit,
      },
      async (amount) => {
        const res = await this.client.guilds.fetch({
          after: options?.after,
          before: options?.before,
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
      Logger.error(e);
    }
  }

  private lastFetchReturnedRecords(
    lastGuildFetch?: Array<DiscordGuildInfo>,
  ): boolean {
    return lastGuildFetch != undefined && lastGuildFetch.length > 0;
  }

  private allGuildsFetched(
    guildsFetched: Array<DiscordGuildInfo>,
    options?: GuildFetchOptionsType,
  ): boolean {
    if (options?.limit == undefined) {
      return false;
    }
    return guildsFetched.length >= options.limit;
  }
}
