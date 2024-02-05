import { AMQPChannel } from "../amqp-channel";
import { Channel } from "amqp-connection-manager";
import { AMQPQueue } from "../amqp-queue";
import { RabbitMQQueueImpl } from "./rabbitmq-queue.impl";
import { AMQPExchange } from "../amqp-exchange";
import { RabbitMQExchangeImpl } from "./rabbitmq-exchange.impl";
import { AMQPBinding } from "../amqp-binding";
import { RabbitMQBindingImpl } from "./rabbitmq-binding.impl";
import { RabbitMQChannelOptions } from "src/amqp/types/rabbitmq-channel-options.type";
import { AssertExchangeOptions } from "src/amqp/types/assert-exchange-options.type";
import { AssertQueueOptions } from "src/amqp/types/assert-queue-options.type";
import { BindQueueToExchangeOptions } from "src/amqp/types/bind-queue-to-exchange-options.type";
import { AMQPMessage } from "../amqp-message";
import { RabbitMQMessageImpl } from "./rabbitmq-message.impl";
import { AMQPExchangeTypeEnum } from "../../types/amqp-exchange-type.enum";
import { LoggerUtils } from "src/utils/logger-utils";

export class RabbitMQChannelImpl implements AMQPChannel {
  public readonly confirm?: boolean;
  public readonly jsonSerialization?: boolean;
  public readonly name?: string;
  public readonly publishTimeoutMs?: number;
  private readonly channel: Channel;

  private static readonly logger = LoggerUtils.from(RabbitMQBindingImpl);

  public constructor(options: RabbitMQChannelOptions) {
    this.confirm = options.confirm ?? true;
    this.jsonSerialization = options.jsonSerialization ?? true;
    this.name = options.name;
    this.publishTimeoutMs = options.publishTimeoutMs;
    this.channel = options.channel;
  }

  public async assertQueue(options: AssertQueueOptions): Promise<AMQPQueue> {
    try {
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
      RabbitMQChannelImpl.logger.log(`RabbitMQ queue created. Queue name: ${options.name}`);

      return new RabbitMQQueueImpl({
        name: options.name,
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
    } catch (e) {
      RabbitMQChannelImpl.logger.fatal(`Failed to create RabbitMQ queue. Queue name: ${options.name}`);
      throw e;
    }
  }

  public async assertExchange(options: AssertExchangeOptions): Promise<AMQPExchange> {
    try {
      const exchange = await this.channel.assertExchange(options.name, options.type, {
        autoDelete: options.autoDelete,
        durable: options.durable,
        internal: options.internal,
      });
      RabbitMQChannelImpl.logger.log(
        `RabbitMQ exchange created. Exchange name: ${options.name} | Type: ${options.type}`,
      );

      return new RabbitMQExchangeImpl({
        exchange: exchange,
        name: options.name,
        type: options.type,
        autoDelete: options.autoDelete,
        durable: options.durable,
        internal: options.internal,
      });
    } catch (e) {
      RabbitMQChannelImpl.logger.fatal(
        `Failed to create RabbitMQ exchange. Exchange name: ${options.name} | Type: ${options.type}`,
      );
      throw e;
    }
  }

  public async bindQueueToExchange(options: BindQueueToExchangeOptions): Promise<AMQPBinding> {
    try {
      let pattern: string;
      if (options.pattern) {
        pattern = options.pattern;
      } else if (
        options.exchange.type === AMQPExchangeTypeEnum.TOPIC ||
        options.exchange.type === AMQPExchangeTypeEnum.DIRECT
      ) {
        pattern = options.queue.name;
      } else {
        pattern = "";
      }

      await this.channel.bindQueue(options.queue.name, options.exchange.name, pattern);
      RabbitMQChannelImpl.logger.log(
        `Bind RabbitMQ queue to exchange. Queue name: ${options.queue.name} | Exchange name: ${options.exchange.name}`,
      );

      return new RabbitMQBindingImpl({
        exchange: options.exchange,
        queue: options.queue,
        pattern: options.pattern,
      });
    } catch (e) {
      RabbitMQChannelImpl.logger.fatal(
        `Failed to bind RabbitMQ queue to exchange. Queue name: ${options.queue.name} | Exchange name: ${options.exchange.name}`,
      );
      throw e;
    }
  }

  public async listenQueue<T>(queue: AMQPQueue, onMessage: (msg: AMQPMessage<T>) => Promise<void>): Promise<void> {
    try {
      await this.channel.consume(queue.name, async (msg) => {
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

            await onMessage(rabbitMessage);
            this.channel.ack(msg);
          } catch (e) {
            RabbitMQChannelImpl.logger.error(e);
            this.channel.nack(msg);
          }
        }
      });
      RabbitMQChannelImpl.logger.log(`RabbitMQ consumer created. Consumer queue name: ${queue.name}`);
    } catch (e) {
      RabbitMQChannelImpl.logger.fatal(`Failed to create RabbitMQ consumer. Consumer queue name: ${queue.name}`);
      throw e;
    }
  }

  public sendMessage<T>(queue: AMQPQueue, msg: T): Promise<void>;
  public sendMessage<T>(exchange: AMQPExchange, routingKey: string, msg: T): Promise<void>;
  public async sendMessage<T>(
    queueOrExchange: AMQPQueue | AMQPExchange,
    msgOrRoutingKey: T | string,
    msg?: string,
  ): Promise<void> {
    if (msg == undefined) {
      return await this.sendMessageWithoutRoutingKey(queueOrExchange, msgOrRoutingKey);
    }

    return await this.sendMessageWithRoutingKey(queueOrExchange as AMQPExchange, msgOrRoutingKey as string, msg);
  }

  private sendMessageWithRoutingKey<T>(exchange: AMQPExchange, routingKey: string, msg: T): Promise<void> {
    const jsonBuffer = Buffer.from(JSON.stringify(msg));

    return new Promise((res, rej) => {
      this.channel.publish(exchange.name, routingKey, jsonBuffer, { contentType: "application/json" }, (err) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }

  private sendMessageWithoutRoutingKey<T>(queue: AMQPQueue, msg: T): Promise<void> {
    const jsonBuffer = Buffer.from(JSON.stringify(msg));

    return new Promise((res, rej) => {
      this.channel.sendToQueue(queue.name, jsonBuffer, { contentType: "application/json" }, (err) => {
        if (err) {
          rej(err);
          return;
        }
        res();
      });
    });
  }
}
