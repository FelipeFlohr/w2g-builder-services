import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DiscordNetworkHandler } from "../../handlers/discord-network.handler";
import { DiscordClientService } from "../discord-client.service";
import { EnvironmentSettingsService } from "src/env/environment-settings.service";
import { DiscordJsClientImpl } from "../../client/impl/discord-js-client.impl";
import { LoggedDiscordClient } from "../../client/logged-discord-client";

@Injectable()
export class DiscordClientImplService
  implements DiscordClientService, OnModuleInit
{
  private readonly networkHandler: DiscordNetworkHandler;
  private readonly envService: EnvironmentSettingsService;
  private _client: LoggedDiscordClient;

  private static readonly logger: Logger = new Logger(
    DiscordClientImplService.name,
  );

  public constructor(
    @Inject(DiscordNetworkHandler) networkHandler: DiscordNetworkHandler,
    @Inject(EnvironmentSettingsService) envService: EnvironmentSettingsService,
  ) {
    this.networkHandler = networkHandler;
    this.envService = envService;
  }

  public async onModuleInit() {
    try {
      const client = new DiscordJsClientImpl();
      this._client = await this.networkHandler.login(
        client,
        this.envService.discordToken,
      );
      DiscordClientImplService.logger.log("Logged into Discord");
    } catch (e) {
      DiscordClientImplService.logger.fatal(
        `Error while logging on Discord: ${e}`,
      );
      throw e;
    }
  }

  public get client() {
    return this._client;
  }
}
