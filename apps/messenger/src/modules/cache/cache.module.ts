import { Global, Module } from "@nestjs/common";
import { EnvironmentSettingsModule } from "../env/environment-settings.module";
import { CacheServiceProvider } from "./providers/cache-service.provider";
import { RedisCacheServiceImpl } from "./services/impl/cache.impl.service";

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
