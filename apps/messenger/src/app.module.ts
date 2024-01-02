import { Module } from "@nestjs/common";
import { DiscordModule } from "./modules/discord/discord.module";
import { EnvironmentSettingsModule } from "./env/environment-settings.module";

@Module({
  imports: [DiscordModule, EnvironmentSettingsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
