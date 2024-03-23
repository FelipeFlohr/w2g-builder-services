import { Module } from "@nestjs/common";
import { DiscordAMQPModule } from "../discord-amqp/discord-amqp.module";
import { DiscordModule } from "../discord/discord.module";
import { MessengerController } from "./controllers/messenger.controller";
import { DiscordDelimitationMessageRepositoryProvider } from "./providers/discord-delimitation-message-repository.provider";
import { DiscordListenerRepositoryProvider } from "./providers/discord-listener-repository.provider";
import { DiscordMessageAuthorRepositoryProvider } from "./providers/discord-message-author-repository.provider";
import { DiscordMessageRepositoryProvider } from "./providers/discord-message-repository.provider";
import { MessengerServiceProvider } from "./providers/messenger-service.provider";
import { DiscordDelimitationMessageRepositoryImpl } from "./repositories/impl/discord-delimitation-message.impl.repository";
import { DiscordListenerRepositoryImpl } from "./repositories/impl/discord-listener.impl.repository";
import { DiscordMessageAuthorRepositoryImpl } from "./repositories/impl/discord-message-author.impl.repository";
import { DiscordMessageRepositoryImpl } from "./repositories/impl/discord-message.impl.repository";
import { MessengerServiceImpl } from "./services/impl/messenger.impl.service";

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
