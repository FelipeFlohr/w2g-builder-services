import { Module } from "@nestjs/common";
import { EnvironmentSettingsModule } from "./modules/env/environment-settings.module";
import { AMQPModule } from "./modules/amqp/amqp.module";
import { CacheModule } from "./modules/cache/cache.module";
import { DatabaseModule } from "./modules/database/database.module";
import { DiscordAMQPModule } from "./modules/discord-amqp/discord-amqp.module";
import { DiscordModule } from "./modules/discord/discord.module";
import { HealthcheckModule } from "./modules/healthcheck/healthcheck.module";
import { MessengerModule } from "./modules/messenger/messenger.module";

@Module({
  imports: [
    EnvironmentSettingsModule,
    AMQPModule,
    CacheModule,
    DatabaseModule,
    DiscordAMQPModule,
    DiscordModule,
    HealthcheckModule,
    MessengerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
