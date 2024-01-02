import { LoggedDiscordClient } from "../client/logged-discord-client";

export interface DiscordClientService {
  readonly client: LoggedDiscordClient;
}

export const DiscordClientService = Symbol("DiscordClientService");
