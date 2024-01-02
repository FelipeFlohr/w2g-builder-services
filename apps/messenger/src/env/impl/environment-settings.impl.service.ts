import * as dotenv from "dotenv";
import { EnvironmentSettingsService } from "../environment-settings.service";
import { DatabaseSettingsType } from "../types/database-settings.type";
import { RabbitMQSetingsType } from "../types/rabbitmq-settings.type";

export class EnvironmentSettingsServiceImpl
  implements EnvironmentSettingsService
{
  public readonly port: number;
  public readonly nodeEnv: "development" | "production";
  public readonly rabbitMqSettings: RabbitMQSetingsType;
  public readonly databaseSettings: DatabaseSettingsType;
  public readonly discordToken: string;

  public constructor() {
    dotenv.config();

    this.port = this.parseInt("APP_PORT") ?? 3000;
    this.nodeEnv = this.parseNodeEnv();
    this.rabbitMqSettings = this.parseRabbitMqSettings();
    this.databaseSettings = this.parseDatabaseSettings();
    this.discordToken = this.parseStringNotNull("DISCORD_TOKEN");
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

  private parseRabbitMqSettings(): RabbitMQSetingsType {
    return {
      host: this.parseStringNotNull("RABBITMQ_HOST"),
      password: this.parseStringNotNull("RABBITMQ_PASSWORD"),
      port: this.parseIntNotNull("RABBITMQ_PORT"),
      user: this.parseStringNotNull("RABBITMQ_USER"),
    };
  }

  private parseNodeEnv(): "development" | "production" {
    return process.env.NODE_EVN === "development"
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
