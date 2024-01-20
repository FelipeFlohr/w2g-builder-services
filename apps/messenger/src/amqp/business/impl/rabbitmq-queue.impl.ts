import { AMQPQueue } from "../amqp-queue";
import { Replies } from "amqplib";
import { AMQPMessage } from "../amqp-message";
import { RabbitMQQueueOptions } from "src/amqp/types/rabbitmq-queue-options.type";

export class RabbitMQQueueImpl<T> implements AMQPQueue<T> {
  public readonly name: string;
  public readonly autodelete?: boolean;
  public readonly deadLetterExchange?: string;
  public readonly deadLetterRoutingKey?: string;
  public readonly durable?: boolean;
  public readonly exclusive?: boolean;
  public readonly expires?: number;
  public readonly maxLength?: number;
  public readonly maxPriority?: number;
  public readonly messageTtl?: number;
  public readonly onMessage: (msg: AMQPMessage<T>) => Promise<void>;
  private readonly queue: Replies.AssertQueue;

  public constructor(options: RabbitMQQueueOptions<T>) {
    this.name = options.name;
    this.autodelete = options.autodelete;
    this.deadLetterExchange = options.deadLetterExchange;
    this.deadLetterRoutingKey = options.deadLetterRoutingKey;
    this.durable = options.durable;
    this.exclusive = options.exclusive;
    this.expires = options.expires;
    this.maxLength = options.maxLength;
    this.maxPriority = options.maxPriority;
    this.messageTtl = options.messageTtl;
    this.onMessage = options.onMessage;
    this.queue = options.queue;
  }
}
