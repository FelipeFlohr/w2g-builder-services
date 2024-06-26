import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { EnvironmentSettingsServiceProvider } from "src/modules/env/providers/environment-settings-service.provider";
import { EnvironmentSettingsService } from "src/modules/env/services/environment-settings.service";
import { EnvironmentSettingsServiceImpl } from "src/modules/env/services/impl/environment-settings.impl.service";
import { DiscordDelimitationMessageTypeORMEntity } from "src/modules/messenger/entities/impl/discord-delimitation-message.typeorm.entity.impl";
import { DiscordListenerTypeORMEntity } from "src/modules/messenger/entities/impl/discord-listener.typeorm.entity";
import { DiscordMessageAuthorTypeORMEntity } from "src/modules/messenger/entities/impl/discord-message-author.typeorm.entity";
import { DiscordMessageTypeORMEntity } from "src/modules/messenger/entities/impl/discord-message.typeorm.entity";
import { LoggerUtils } from "src/utils/logger.utils";
import { DataSource } from "typeorm";
import { TypeORMLogger } from "../../logger/typeorm.logger";
import { Migration11710456005183 } from "../../migrations/1710456005183-migration1";

@Injectable()
export class DatabaseServiceImpl implements OnModuleInit {
  public readonly datasource: DataSource;
  private readonly envService: EnvironmentSettingsService;

  private static readonly logger = LoggerUtils.from(DatabaseServiceImpl);

  public constructor(@Inject(EnvironmentSettingsServiceProvider) envService: EnvironmentSettingsService) {
    this.envService = envService;
    this.datasource = new DataSource({
      type: "postgres",
      host: this.envService.database.host,
      port: this.envService.database.port,
      username: this.envService.database.user,
      password: this.envService.database.password,
      database: this.envService.database.name,
      entities: [
        DiscordDelimitationMessageTypeORMEntity,
        DiscordMessageTypeORMEntity,
        DiscordMessageAuthorTypeORMEntity,
        DiscordListenerTypeORMEntity,
      ],
      migrations: [Migration11710456005183],
      synchronize: true,
      logger: new TypeORMLogger("all"),
    });
  }

  public async onModuleInit() {
    DatabaseServiceImpl.logger.log("Initializing database");
    try {
      await this.datasource.initialize();
      DatabaseServiceImpl.logger.log("Database initialized");
    } catch (e) {
      DatabaseServiceImpl.logger.fatal(e);
      throw e;
    }
  }
}

const service = new DatabaseServiceImpl(EnvironmentSettingsServiceImpl.getInstance());
export const datasource = service.datasource;
