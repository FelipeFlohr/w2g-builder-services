import { Module } from "@nestjs/common";
import { DiscordModule } from "./modules/discord/discord.module";
import { EnvironmentSettingsModule } from "./env/environment-settings.module";
import { DatabaseModule } from "./database/database.module";
import { AMQPModule } from "./amqp/amqp.module";

@Module({
  imports: [
    DiscordModule,
    EnvironmentSettingsModule,
    DatabaseModule,
    AMQPModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
