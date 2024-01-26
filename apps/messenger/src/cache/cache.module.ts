import { Global, Module } from "@nestjs/common";
import { CacheService } from "./cache.service";
import { RedisCacheServiceImpl } from "./impl/cache.impl.service";
import { EnvironmentSettingsModule } from "src/env/environment-settings.module";

@Global()
@Module({
  providers: [
    {
      provide: CacheService,
      useClass: RedisCacheServiceImpl,
    },
  ],
  imports: [EnvironmentSettingsModule],
  exports: [CacheService],
})
export class CacheModule {}
