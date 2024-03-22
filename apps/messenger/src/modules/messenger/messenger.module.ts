import { Module } from "@nestjs/common";
import { DiscordDelimitationMessageRepositoryProvider } from "./providers/discord-delimitation-message-repository.provider";
import { DiscordDelimitationMessageRepositoryImpl } from "./repositories/impl/discord-delimitation-message.impl.repository";
import { DiscordListenerRepositoryProvider } from "./providers/discord-listener-repository.provider";
import { DiscordListenerRepositoryImpl } from "./repositories/impl/discord-listener.impl.repository";
import { DiscordMessageAuthorRepositoryProvider } from "./providers/discord-message-author-repository.provider";
import { DiscordMessageAuthorRepositoryImpl } from "./repositories/impl/discord-message-author.impl.repository";
import { DiscordMessageRepositoryProvider } from "./providers/discord-message-repository.provider";
import { DiscordMessageRepositoryImpl } from "./repositories/impl/discord-message.impl.repository";
import { MessengerServiceProvider } from "./providers/messenger-service.provider";
import { MessengerServiceImpl } from "./services/impl/messenger.impl.service";
import { DiscordModule } from "../discord/discord.module";
import { MessengerController } from "./controllers/messenger.controller";
import { DiscordAMQPModule } from "../discord-amqp/discord-amqp.module";

@Module({
  controllers: [MessengerController],
  providers: [
    {
      provide: DiscordDelimitationMessageRepositoryProvider,
      useClass: DiscordDelimitationMessageRepositoryImpl,
    },
    {
      provide: DiscordListenerRepositoryProvider,
      useClass: DiscordListenerRepositoryImpl,
    },
    {
      provide: DiscordMessageAuthorRepositoryProvider,
      useClass: DiscordMessageAuthorRepositoryImpl,
    },
    {
      provide: DiscordMessageRepositoryProvider,
      useClass: DiscordMessageRepositoryImpl,
    },
    {
      provide: MessengerServiceProvider,
      useClass: MessengerServiceImpl,
    },
  ],
  imports: [DiscordModule, DiscordAMQPModule],
  exports: [MessengerServiceProvider],
})
export class MessengerModule {}
