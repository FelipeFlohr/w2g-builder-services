import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { AMQPService } from "../amqp.service";
import { EnvironmentSettingsService } from "src/env/environment-settings.service";
import amqp, { Channel } from "amqp-connection-manager";
import { IAmqpConnectionManager } from "amqp-connection-manager/dist/types/AmqpConnectionManager";
import { AMQPChannel } from "src/amqp/business/amqp-channel";
import { RabbitMQChannelImpl } from "src/amqp/business/impl/rabbitmq-channel.impl";
import { LoggerUtils } from "src/utils/logger-utils";

@Injectable()
export class RabbitMQServiceImpl implements AMQPService, OnModuleInit {
  private readonly env: EnvironmentSettingsService;
  private connection: IAmqpConnectionManager;
  private _channel: AMQPChannel;

  private static readonly logger = LoggerUtils.from(RabbitMQChannelImpl);
  private static readonly APPLICATION_CHANNEL_NAME = "messenger-channel";
  private static readonly RABBITMQ_TIMEOUT = 15 * 1000;

  public constructor(
    @Inject(EnvironmentSettingsService) env: EnvironmentSettingsService,
  ) {
    this.env = env;
  }

  public async onModuleInit() {
    await this.login();
    this._channel = await this.createChannel();
  }

  private async login(): Promise<void> {
    const url = new URL(`amqp://${this.env.rabbitMq.host}`);
    url.username = this.env.rabbitMq.user;
    url.password = this.env.rabbitMq.password;
    url.port = this.env.rabbitMq.port.toString();

    this.connection = amqp.connect({
      url: url.toString(),
    });

    RabbitMQServiceImpl.logger.log("Connecting to RabbitMQ.");
    try {
      await this.connection.connect({
        timeout: RabbitMQServiceImpl.RABBITMQ_TIMEOUT,
      });
      RabbitMQServiceImpl.logger.log("Connected to RabbitMQ.");
    } catch (e) {
      RabbitMQServiceImpl.logger.fatal(e);
      throw e;
    }
  }

  private createChannel(): Promise<AMQPChannel> {
    RabbitMQServiceImpl.logger.log(
      `Creating RabbitMQ channel. Channel name: ${RabbitMQServiceImpl.APPLICATION_CHANNEL_NAME}.`,
    );

    return new Promise<AMQPChannel>((res) => {
      this.connection.createChannel({
        json: true,
        name: RabbitMQServiceImpl.APPLICATION_CHANNEL_NAME,
        setup: (channel: Channel) => {
          RabbitMQServiceImpl.logger.log(
            `RabbitMQ channel created. Channel name: ${RabbitMQServiceImpl.APPLICATION_CHANNEL_NAME}`,
          );

          const rabbitMqChannel = new RabbitMQChannelImpl({
            channel: channel,
            jsonSerialization: true,
            name: RabbitMQServiceImpl.APPLICATION_CHANNEL_NAME,
          });
          res(rabbitMqChannel);
        },
      });
    });
  }

  public get channel() {
    return this._channel;
  }
}
