import { ApplicationSettingsType } from "./types/application-settings.type";
import { DatabaseSettingsType } from "./types/database-settings.type";
import { RabbitMQSettingsType } from "./types/rabbitmq-settings.type";
import { RedisSettingsType } from "./types/redis-settings.type";

export interface EnvironmentSettingsService {
  readonly application: ApplicationSettingsType;
  readonly rabbitMq: RabbitMQSettingsType;
  readonly database: DatabaseSettingsType;
  readonly redis: RedisSettingsType;
  readonly discordToken: string;
}

export const EnvironmentSettingsService = Symbol("EnvironmentSettingsService");
