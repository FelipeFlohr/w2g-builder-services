import { LoggedDiscordClient } from "../client/logged-discord-client";

export interface DiscordClientService {
  readonly client: LoggedDiscordClient;
  setupSlashCommands(): Promise<void>;
}

export const DiscordClientService = Symbol("DiscordClientService");
