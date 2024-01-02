import { DiscordClient } from "../client/discord-client";
import { LoggedDiscordClient } from "../client/logged-discord-client";

export interface DiscordNetworkHandler {
  login(client: DiscordClient, token: string): Promise<LoggedDiscordClient>;
}

export const DiscordNetworkHandler = Symbol("DiscordNetworkHandler");
