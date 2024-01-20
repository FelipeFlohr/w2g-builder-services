import { Module } from "@nestjs/common";
import { DiscordClientService } from "./services/discord-client.service";
import { DiscordClientServiceImpl } from "./services/impl/discord-client.impl.service";
import { DiscordNetworkHandler } from "./handlers/discord-network.handler";
import { DiscordNetworkHandlerImpl } from "./handlers/impl/discord-network.impl.handler";
import { DiscordService } from "./services/discord.service";
import { DiscordServiceImpl } from "./services/impl/discord.impl.service";
import { DiscordControllerImpl } from "./controllers/impl/discord.impl.controller";
import { DiscordListenerRepository } from "./repositories/discord-listener.repository";
import { DiscordListenerRepositoryImpl } from "./repositories/impl/discord-listener.impl.repository";
import { DiscordCommandRepository } from "./repositories/discord-command.repository";
import { DiscordCommandRepositoryImpl } from "./repositories/impl/discord-command.impl.repository";
import { DiscordSlashCommandHandler } from "./handlers/discord-slash-command.handler";
import { DiscordSlashCommandHandlerImpl } from "./handlers/impl/discord-slash-command.impl.handler";

@Module({
  providers: [
    {
      provide: DiscordClientService,
      useClass: DiscordClientServiceImpl,
    },
    {
      provide: DiscordService,
      useClass: DiscordServiceImpl,
    },
    {
      provide: DiscordNetworkHandler,
      useClass: DiscordNetworkHandlerImpl,
    },
    {
      provide: DiscordListenerRepository,
      useClass: DiscordListenerRepositoryImpl,
    },
    {
      provide: DiscordCommandRepository,
      useClass: DiscordCommandRepositoryImpl,
    },
    {
      provide: DiscordSlashCommandHandler,
      useClass: DiscordSlashCommandHandlerImpl,
    },
  ],
  exports: [DiscordService],
  controllers: [DiscordControllerImpl],
})
export class DiscordModule {}
