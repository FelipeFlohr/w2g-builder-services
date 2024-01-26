import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { EnvironmentSettingsService } from "src/env/environment-settings.service";
import { EnvironmentSettingsServiceImpl } from "src/env/impl/environment-settings.impl.service";
import { DiscordListenerTypeORMEntity } from "src/modules/discord/entities/impl/discord-listener.typeorm.entity";
import { DataSource } from "typeorm";
import { TypeORMLogger } from "../logger/typeorm.logger";
import { Migration11705272458625 } from "../migrations/1705272458625-migration1";
import { DiscordMessageTypeORMEntity } from "src/modules/discord/entities/impl/discord-message.typeorm.entity";
import { DiscordMessageAuthorTypeORMEntity } from "src/modules/discord/entities/impl/discord-message-author.typeorm.entity";
import { Migration21705866336900 } from "../migrations/1705866336900-migration2";
import { DiscordDelimitationMessageTypeORMEntity } from "src/modules/discord/entities/impl/discord-delimitation-message.typeorm.entity";
import { Migration31705869159816 } from "../migrations/1705869159816-migration3";
import { LoggerUtils } from "src/utils/logger-utils";
import { Migration41706220115643 } from "../migrations/1706220115643-migration4";

@Injectable()
export class DatabaseServiceImpl implements OnModuleInit {
  public readonly datasource: DataSource;
  private readonly envService: EnvironmentSettingsService;

  private static readonly logger = LoggerUtils.from(DatabaseServiceImpl);

  public constructor(
    @Inject(EnvironmentSettingsService) envService: EnvironmentSettingsService,
  ) {
    this.envService = envService;
    this.datasource = new DataSource({
      type: "postgres",
      host: this.envService.database.host,
      port: this.envService.database.port,
      username: this.envService.database.user,
      password: this.envService.database.password,
      database: this.envService.database.name,
      entities: [
        DiscordListenerTypeORMEntity,
        DiscordMessageTypeORMEntity,
        DiscordMessageAuthorTypeORMEntity,
        DiscordDelimitationMessageTypeORMEntity,
      ],
      migrations: [
        Migration11705272458625,
        Migration21705866336900,
        Migration31705869159816,
        Migration41706220115643,
      ],
      synchronize: envService.application.env === "development",
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
