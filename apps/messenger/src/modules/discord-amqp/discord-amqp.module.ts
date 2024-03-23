import { Module } from "@nestjs/common";
import { AMQPModule } from "../amqp/amqp.module";
import { DiscordAMQPServiceProvider } from "./providers/discord-amqp-service.provider";
import { DiscordAMQPServiceImpl } from "./services/impl/discord-amqp.impl.service";

@Module({
  providers: [
    {
      provide: DiscordAMQPServiceProvider,
      useClass: DiscordAMQPServiceImpl,
    },
  ],
  imports: [AMQPModule],
  exports: [DiscordAMQPServiceProvider],
})
export class DiscordAMQPModule {}
