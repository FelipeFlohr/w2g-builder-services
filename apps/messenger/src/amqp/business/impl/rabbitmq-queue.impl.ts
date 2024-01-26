import { AMQPQueue } from "../amqp-queue";
import { Replies } from "amqplib";
import { RabbitMQQueueOptions } from "src/amqp/types/rabbitmq-queue-options.type";

export class RabbitMQQueueImpl implements AMQPQueue {
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
  private readonly queue: Replies.AssertQueue;

  public constructor(options: RabbitMQQueueOptions) {
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
    this.queue = options.queue;
  }
}
