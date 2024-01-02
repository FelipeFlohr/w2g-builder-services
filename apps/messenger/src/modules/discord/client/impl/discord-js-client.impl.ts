import { Client, Events, GatewayIntentBits } from "discord.js";
import { DiscordClient } from "../discord-client";

export class DiscordJsClientImpl implements DiscordClient {
  public readonly client: Client;

  public constructor(client?: Client) {
    this.client = client ?? new Client({ intents: [GatewayIntentBits.Guilds] });
  }

  public async login(token: string): Promise<DiscordClient> {
    if (!this.client.isReady()) {
      await this.client.login(token);
      await this.waitForLogin();
    }
    return this;
  }

  public async getClientAsTrue(): Promise<Client<true>> {
    return this.client as Client<true>;
  }

  private waitForLogin(): Promise<Client<true>> {
    return new Promise((res) => this.client.once(Events.ClientReady, res));
  }
}
