import { DatabaseSettingsType } from "./types/database-settings.type";
import { RabbitMQSetingsType } from "./types/rabbitmq-settings.type";

export interface EnvironmentSettingsService {
  readonly port: number;
  readonly nodeEnv: "development" | "production";
  readonly rabbitMqSettings: RabbitMQSetingsType;
  readonly databaseSettings: DatabaseSettingsType;
  readonly discordToken: string;
}

export const EnvironmentSettingsService = Symbol("EnvironmentSettingsService");
