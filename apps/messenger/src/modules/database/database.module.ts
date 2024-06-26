import { Global, Module } from "@nestjs/common";
import { EnvironmentSettingsModule } from "../env/environment-settings.module";
import { DatabaseServiceProvider } from "./providers/database-service.provider";
import { DatabaseServiceImpl } from "./services/impl/database.impl.service";

@Global()
@Module({
  providers: [
    {
      provide: DatabaseServiceProvider,
      useClass: DatabaseServiceImpl,
    },
  ],
  imports: [EnvironmentSettingsModule],
  exports: [DatabaseServiceProvider],
})
export class DatabaseModule {}
