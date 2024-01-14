import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { EnvironmentSettingsService } from "src/env/environment-settings.service";
import { EnvironmentSettingsServiceImpl } from "src/env/impl/environment-settings.impl.service";
import { DiscordListenerTypeORMEntity } from "src/modules/discord/entities/impl/discord-listener.typeorm.entity";
import { DataSource } from "typeorm";
import { TypeORMLogger } from "../logger/typeorm.logger";
import { Migration11705272458625 } from "../migrations/1705272458625-migration1";

@Injectable()
export class DatabaseServiceImpl implements OnModuleInit {
  public readonly datasource: DataSource;
  private readonly envService: EnvironmentSettingsService;

  private static readonly logger = new Logger(DatabaseServiceImpl.name);

  public constructor(
    @Inject(EnvironmentSettingsService) envService: EnvironmentSettingsService,
  ) {
    this.envService = envService;
    this.datasource = new DataSource({
      type: "postgres",
      host: this.envService.databaseSettings.host,
      port: this.envService.databaseSettings.port,
      username: this.envService.databaseSettings.user,
      password: this.envService.databaseSettings.password,
      database: this.envService.databaseSettings.name,
      entities: [DiscordListenerTypeORMEntity],
      migrations: [Migration11705272458625],
      synchronize: true,
      logger: new TypeORMLogger("all"),
    });
  }

  public async onModuleInit() {
    DatabaseServiceImpl.logger.warn("Initializing database");
    try {
      await this.datasource.initialize();
      DatabaseServiceImpl.logger.debug("Database initialized");
    } catch (e) {
      DatabaseServiceImpl.logger.fatal(e);
      throw e;
    }
  }
}

const service = new DatabaseServiceImpl(
  EnvironmentSettingsServiceImpl.getInstance(),
);
export const datasource = service.datasource;
