import { Module } from "@nestjs/common";
import { DiscordServiceProvider } from "./providers/discord-service.provider";
import { DiscordServiceImpl } from "./services/impl/discord.impl.service";
import { EnvironmentSettingsModule } from "../env/environment-settings.module";
import { DiscordController } from "./controllers/discord.controller";

@Module({
  controllers: [DiscordController],
  providers: [
    {
      provide: DiscordServiceProvider,
      useClass: DiscordServiceImpl,
    },
  ],
  imports: [EnvironmentSettingsModule],
  exports: [DiscordServiceProvider],
})
export class DiscordModule {}
