import { AMQPChannel } from "../amqp-channel";
import { Channel } from "amqp-connection-manager";
import { AMQPQueue } from "../amqp-queue";
import { RabbitMQQueueImpl } from "./rabbitmq-queue.impl";
import { RabbitMQMessageImpl } from "./rabbitmq-message.impl";
import { Logger } from "@nestjs/common";
import { AMQPExchange } from "../amqp-exchange";
import { RabbitMQExchangeImpl } from "./rabbitmq-exchange.impl";
import { AMQPBinding } from "../amqp-binding";
import { RabbitMQBindingImpl } from "./rabbitmq-binding.impl";
import { RabbitMQChannelOptions } from "src/amqp/types/rabbitmq-channel-options.type";
import { AssertExchangeOptions } from "src/amqp/types/assert-exchange-options.type";
import { AssertQueueOptions } from "src/amqp/types/assert-queue-options.type";
import { BindQueueToExchangeOptions } from "src/amqp/types/bind-queue-to-exchange-options.type";

export class RabbitMQChannelImpl implements AMQPChannel {
  public readonly confirm?: boolean;
  public readonly jsonSerialization?: boolean;
  public readonly name?: string;
  public readonly publishTimeoutMs?: number;
  private readonly channel: Channel;

  private static readonly logger = new Logger(RabbitMQChannelImpl.name);

  public constructor(options: RabbitMQChannelOptions) {
    this.confirm = options.confirm ?? true;
    this.jsonSerialization = options.jsonSerialization ?? true;
    this.name = options.name;
    this.publishTimeoutMs = options.publishTimeoutMs;
    this.channel = options.channel;
  }

  public async assertQueue<T>(
    options: AssertQueueOptions<T>,
  ): Promise<AMQPQueue<T>> {
    RabbitMQChannelImpl.logger.log(
      `Creating RabbitMQ queue. Queue name: ${options.name}`,
    );
    const mqQueue = await this.channel.assertQueue(options.name, {
      autoDelete: options.autodelete,
      deadLetterExchange: options.deadLetterExchange,
      deadLetterRoutingKey: options.deadLetterRoutingKey,
      durable: options.durable,
      exclusive: options.exclusive,
      expires: options.expires,
      maxLength: options.maxLength,
      maxPriority: options.maxPriority,
      messageTtl: options.messageTtl,
    });
    RabbitMQChannelImpl.logger.log(
      `RabbitMQ queue created. Queue name: ${options.name}`,
    );

    RabbitMQChannelImpl.logger.log(
      `Creating RabbitMQ consumer. Consumer queue name: ${options.name}`,
    );
    await this.channel.consume(options.name, async (msg) => {
      if (msg) {
        try {
          const contentJson = msg.content.toString();
          const contentObj = JSON.parse(contentJson) as T;
          const rabbitMessage = new RabbitMQMessageImpl<T>({
            consumerTag: msg.fields.consumerTag,
            content: contentObj,
            deliveryTag: msg.fields.deliveryTag,
            exchange: msg.fields.exchange,
            message: msg,
            redelivered: msg.fields.redelivered,
            routingKey: msg.fields.routingKey,
          });

          await options.onMessage(rabbitMessage);
          this.channel.ack(msg);
        } catch (e) {
          RabbitMQChannelImpl.logger.error(e);
          this.channel.nack(msg);
        }
      }
    });
    RabbitMQChannelImpl.logger.log(
      `RabbitMQ consumer created. Consumer queue name: ${options.name}`,
    );

    return new RabbitMQQueueImpl<T>({
      name: options.name,
      onMessage: options.onMessage,
      queue: mqQueue,
      autodelete: options.autodelete,
      deadLetterExchange: options.deadLetterExchange,
      deadLetterRoutingKey: options.deadLetterRoutingKey,
      durable: options.durable,
      exclusive: options.exclusive,
      expires: options.expires,
      maxLength: options.maxLength,
      maxPriority: options.maxPriority,
      messageTtl: options.messageTtl,
    });
  }

  public async assertExchange(
    options: AssertExchangeOptions,
  ): Promise<AMQPExchange> {
    RabbitMQChannelImpl.logger.log(
      `Creating RabbitMQ exchange. Exchange name: ${options.name}`,
    );
    const exchange = await this.channel.assertExchange(
      options.name,
      options.type,
      {
        autoDelete: options.autoDelete,
        durable: options.durable,
        internal: options.internal,
      },
    );
    RabbitMQChannelImpl.logger.log(
      `RabbitMQ exchange created. Exchange name: ${options.name}`,
    );

    return new RabbitMQExchangeImpl({
      exchange: exchange,
      name: options.name,
      type: options.type,
      autoDelete: options.autoDelete,
      durable: options.durable,
      internal: options.internal,
    });
  }

  public async bindQueueToExchange<T>(
    options: BindQueueToExchangeOptions<T>,
  ): Promise<AMQPBinding<T>> {
    RabbitMQChannelImpl.logger.log(
      `Binding RabbitMQ queue to exchange. Queue name: ${options.queue.name} | Exchange name: ${options.exchange.name}`,
    );
    await this.channel.bindQueue(
      options.queue.name,
      options.exchange.name,
      options.pattern ?? "",
    );
    RabbitMQChannelImpl.logger.log(
      `Binding RabbitMQ queue to exchange. Queue name: ${options.queue.name} | Exchange name: ${options.exchange.name}`,
    );

    return new RabbitMQBindingImpl({
      exchange: options.exchange,
      queue: options.queue,
      pattern: options.pattern,
    });
  }
}
