import { Module } from "@nestjs/common";
import { DiscordModule } from "./modules/discord/discord.module";
import { EnvironmentSettingsModule } from "./env/environment-settings.module";
import { DatabaseModule } from "./database/database.module";
import { AMQPModule } from "./amqp/amqp.module";
import { CacheModule } from "./cache/cache.module";

@Module({
  imports: [EnvironmentSettingsModule, CacheModule, DatabaseModule, AMQPModule, DiscordModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
