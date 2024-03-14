import { Global, Module } from "@nestjs/common";
import { AMQPServiceProvider } from "./providers/amqp-service.provider";
import { RabbitMQServiceImpl } from "./services/impl/rabbitmq.impl.service";
import { EnvironmentSettingsModule } from "../env/environment-settings.module";

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
