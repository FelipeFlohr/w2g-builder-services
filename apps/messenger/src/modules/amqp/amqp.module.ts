import { Global, Module } from "@nestjs/common";
import { EnvironmentSettingsModule } from "../env/environment-settings.module";
import { AMQPServiceProvider } from "./providers/amqp-service.provider";
import { RabbitMQServiceImpl } from "./services/impl/rabbitmq.impl.service";

@Global()
@Module({
  providers: [
    {
      provide: AMQPServiceProvider,
      useClass: RabbitMQServiceImpl,
    },
  ],
  exports: [AMQPServiceProvider],
  imports: [EnvironmentSettingsModule],
})
export class AMQPModule {}
