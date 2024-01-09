import { Module } from "@nestjs/common";
import { DiscordClientService } from "./services/discord-client.service";
import { DiscordClientImplService } from "./services/impl/discord-client.impl.service";
import { DiscordNetworkHandler } from "./handlers/discord-network.handler";
import { DiscordNetworkHandlerImpl } from "./handlers/impl/discord-network.impl.handler";
import { DiscordService } from "./services/discord.service";
import { DiscordServiceImpl } from "./services/impl/discord.impl.service";
import { DiscordControllerImpl } from "./controllers/impl/discord.impl.controller";

@Module({
  providers: [
    {
      provide: DiscordClientService,
      useClass: DiscordClientImplService,
    },
    {
      provide: DiscordService,
      useClass: DiscordServiceImpl,
    },
    {
      provide: DiscordNetworkHandler,
      useClass: DiscordNetworkHandlerImpl,
    },
  ],
  exports: [DiscordService],
  controllers: [DiscordControllerImpl],
})
export class DiscordModule {}
