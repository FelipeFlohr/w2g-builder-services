export interface DiscordClient {
  login(token: string): Promise<DiscordClient>;
}
