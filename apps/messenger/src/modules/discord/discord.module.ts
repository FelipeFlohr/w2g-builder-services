import { Module } from "@nestjs/common";
import { DiscordClientService } from "./services/discord-client.service";
import { DiscordClientServiceImpl } from "./services/impl/discord-client.impl.service";
import { DiscordNetworkHandler } from "./handlers/discord-network.handler";
import { DiscordNetworkHandlerImpl } from "./handlers/impl/discord-network.impl.handler";
import { DiscordService } from "./services/discord.service";
import { DiscordServiceImpl } from "./services/impl/discord.impl.service";
import { DiscordControllerImpl } from "./controllers/impl/discord.impl.controller";
import {
  DiscordListenerCacheRepository,
  DiscordListenerRepository,
} from "./repositories/discord-listener.repository";
import { DiscordListenerRepositoryImpl } from "./repositories/impl/discord-listener.impl.repository";
import { DiscordCommandRepository } from "./repositories/discord-command.repository";
import { DiscordCommandRepositoryImpl } from "./repositories/impl/discord-command.impl.repository";
import { DiscordSlashCommandHandler } from "./handlers/discord-slash-command.handler";
import { DiscordSlashCommandHandlerImpl } from "./handlers/impl/discord-slash-command.impl.handler";
import { DiscordAMQPService } from "./amqp/discord-amqp.service";
import { DiscordAMQPServiceImpl } from "./amqp/impl/discord-amqp.impl.service";
import { AMQPModule } from "src/amqp/amqp.module";
import { DiscordDelimitationMessageRepository } from "./repositories/discord-delimitation-message.repository";
import { DiscordDelimitationMessageRepositoryImpl } from "./repositories/impl/discord-delimitation-message.impl.repository";
import { DiscordMessageRepository } from "./repositories/discord-messasge.repository";
import { DiscordMessageRepositoryImpl } from "./repositories/impl/discord-message.impl.repository";
import { DiscordListenerCacheRepositoryImpl } from "./repositories/impl/discord-listener-cache.impl.repository";
import { CacheModule } from "src/cache/cache.module";

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
    {
      provide: DiscordAMQPService,
      useClass: DiscordAMQPServiceImpl,
    },
    {
      provide: DiscordMessageRepository,
      useClass: DiscordMessageRepositoryImpl,
    },
    {
      provide: DiscordDelimitationMessageRepository,
      useClass: DiscordDelimitationMessageRepositoryImpl,
    },
    {
      provide: DiscordListenerCacheRepository,
      useClass: DiscordListenerCacheRepositoryImpl,
    },
  ],
  imports: [AMQPModule, CacheModule],
  exports: [DiscordService],
  controllers: [DiscordControllerImpl],
})
export class DiscordModule {}
