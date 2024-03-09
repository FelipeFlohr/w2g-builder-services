import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import { LoggerUtils } from "src/utils/logger-utils";

@Injectable()
export class EnvironmentService {
  public readonly appName: string;
  public readonly port: number;
  public readonly youtubeCommand: string;
  public readonly fileStorageAddress: string;

  private static readonly logger = LoggerUtils.from(EnvironmentService);
  private static instance: EnvironmentService;

  public constructor() {
    config();

    this.appName = this.parseStringNotNull("APP_NAME");
    this.port = this.parseIntNotNull("APP_PORT");
    this.youtubeCommand = this.parseStringNotNull("DOWNLOADER_YOUTUBE_YTDL_COMMAND");
    this.fileStorageAddress = this.parseStringNotNull("DOWNLOADER_FILE_STORAGE_ADDRESS");
  }

  public static getInstance(): EnvironmentService {
    if (this.instance == undefined) {
      this.instance = new EnvironmentService();
      this.logger.debug(`Initialized ${EnvironmentService.name}`);
    }
    return this.instance;
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

    throw new Error(`Variable ${variable} must be an integer. The found value was: ${val}`);
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

    throw new Error(`Variable ${variable} must be a string. The found value was: ${val}`);
  }
}
