import { Module } from "@nestjs/common";
import { DiscordModule } from "./modules/discord/discord.module";
import { EnvironmentSettingsModule } from "./env/environment-settings.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [DiscordModule, EnvironmentSettingsModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
