import { Global, Module } from "@nestjs/common";
import { EnvironmentSettingsService } from "./environment-settings.service";
import { EnvironmentSettingsServiceImpl } from "./impl/environment-settings.impl.service";

@Global()
@Module({
  providers: [
    {
      provide: EnvironmentSettingsService,
      useClass: EnvironmentSettingsServiceImpl,
    },
  ],
  exports: [EnvironmentSettingsService],
})
export class EnvironmentSettingsModule {}
