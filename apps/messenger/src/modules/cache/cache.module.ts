import { Global, Module } from "@nestjs/common";
import { CacheServiceProvider } from "./providers/cache-service.provider";
import { RedisCacheServiceImpl } from "./services/impl/cache.impl.service";
import { EnvironmentSettingsModule } from "../env/environment-settings.module";

@Global()
@Module({
  providers: [
    {
      provide: CacheServiceProvider,
      useClass: RedisCacheServiceImpl,
    },
  ],
  imports: [EnvironmentSettingsModule],
  exports: [CacheServiceProvider],
})
export class CacheModule {}
