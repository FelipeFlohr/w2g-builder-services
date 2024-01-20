import { Global, Module } from "@nestjs/common";
import { AMQPService } from "./services/amqp.service";
import { RabbitMQServiceImpl } from "./services/impl/rabbitmq.impl.service";

@Global()
@Module({
  providers: [
    {
      provide: AMQPService,
      useClass: RabbitMQServiceImpl,
    },
  ],
  exports: [AMQPService],
})
export class AMQPModule {}
