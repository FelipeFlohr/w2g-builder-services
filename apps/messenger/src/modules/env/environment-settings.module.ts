import { Global, Module } from "@nestjs/common";
import { EnvironmentSettingsServiceProvider } from "./providers/environment-settings-service.provider";
import { EnvironmentSettingsServiceImpl } from "./services/impl/environment-settings.impl.service";

@Global()
@Module({
  providers: [
    {
      provide: EnvironmentSettingsServiceProvider,
      useValue: EnvironmentSettingsServiceImpl.getInstance(),
    },
  ],
  exports: [EnvironmentSettingsServiceProvider],
})
export class EnvironmentSettingsModule {}
