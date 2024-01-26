import * as dotenv from "dotenv";
import { EnvironmentSettingsService } from "../environment-settings.service";
import { DatabaseSettingsType } from "../types/database-settings.type";
import { RabbitMQSettingsType } from "../types/rabbitmq-settings.type";
import { RedisSettingsType } from "../types/redis-settings.type";
import { ApplicationSettingsType } from "../types/application-settings.type";
import { LoggerUtils } from "src/utils/logger-utils";

export class EnvironmentSettingsServiceImpl
  implements EnvironmentSettingsService
{
  public readonly application: ApplicationSettingsType;
  public readonly rabbitMq: RabbitMQSettingsType;
  public readonly database: DatabaseSettingsType;
  public readonly redis: RedisSettingsType;
  public readonly discordToken: string;

  private static readonly logger = LoggerUtils.from(
    EnvironmentSettingsServiceImpl,
  );
  private static instance: EnvironmentSettingsServiceImpl;

  public constructor() {
    dotenv.config();

    this.application = this.parseApplicationSettings();
    this.rabbitMq = this.parseRabbitMqSettings();
    this.database = this.parseDatabaseSettings();
    this.redis = this.parseRedisSettings();
    this.discordToken = this.parseStringNotNull("DISCORD_TOKEN");
  }

  public static getInstance(): EnvironmentSettingsServiceImpl {
    if (this.instance == undefined) {
      this.instance = new EnvironmentSettingsServiceImpl();
      EnvironmentSettingsServiceImpl.logger.debug(
        `Initialized ${EnvironmentSettingsServiceImpl.name}`,
      );
    }
    return this.instance;
  }

  private parseApplicationSettings(): ApplicationSettingsType {
    return {
      env: this.parseNodeEnv(),
      name: this.parseStringNotNull("APP_NAME"),
      port: this.parseInt("APP_PORT") ?? 3000,
    };
  }

  private parseDatabaseSettings(): DatabaseSettingsType {
    return {
      host: this.parseStringNotNull("DATABASE_HOST"),
      port: this.parseIntNotNull("DATABASE_PORT"),
      name: this.parseStringNotNull("DATABASE_NAME"),
      password: this.parseStringNotNull("DATABASE_PASSWORD"),
      user: this.parseStringNotNull("DATABASE_USER"),
    };
  }

  private parseRabbitMqSettings(): RabbitMQSettingsType {
    return {
      host: this.parseStringNotNull("RABBITMQ_HOST"),
      password: this.parseStringNotNull("RABBITMQ_PASSWORD"),
      port: this.parseIntNotNull("RABBITMQ_PORT"),
      user: this.parseStringNotNull("RABBITMQ_USER"),
    };
  }

  private parseRedisSettings(): RedisSettingsType {
    return {
      host: this.parseStringNotNull("REDIS_HOST"),
      port: this.parseIntNotNull("REDIS_PORT"),
      password: this.parseString("REDIS_PASSWORD"),
    };
  }

  private parseNodeEnv(): "development" | "production" {
    return process.env.NODE_ENV === "development"
      ? "development"
      : "production";
  }

  private parseInt(variable: string): number | undefined {
    const val = process.env[variable];
    if (val != undefined && !isNaN(parseInt(val))) {
      return parseInt(val);
    }
  }

  private parseIntNotNull(variable: string): number {
    const val = this.parseInt(variable);
    if (val != undefined) {
      return val;
    }

    throw new Error(
      `Variable ${variable} must be an integer. The found value was: ${val}`,
    );
  }

  private parseString(variable: string): string | undefined {
    const val = process.env[variable]?.trim();
    if (typeof val === "string" && val != "") {
      return val.trim();
    }
  }

  private parseStringNotNull(variable: string): string {
    const val = this.parseString(variable);
    if (val != undefined) {
      return val;
    }

    throw new Error(
      `Variable ${variable} must be a string. The found value was: ${val}`,
    );
  }
}
