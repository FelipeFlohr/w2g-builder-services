import { Injectable } from "@nestjs/common";
import { DiscordNetworkHandler } from "../discord-network.handler";
import { DiscordClient } from "../../client/discord-client";
import { LoggedDiscordClient } from "../../client/logged-discord-client";
import { LoggedDiscordJsClientImpl } from "../../client/impl/logged-discord-js-client.impl";

@Injectable()
export class DiscordNetworkHandlerImpl implements DiscordNetworkHandler {
  public async login(client: DiscordClient, token: string): Promise<LoggedDiscordClient> {
    const clientLogged = await client.login(token);
    return LoggedDiscordJsClientImpl.fromClient(clientLogged);
  }
}
