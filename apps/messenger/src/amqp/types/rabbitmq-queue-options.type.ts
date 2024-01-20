import { Replies } from "amqplib";
import { AMQPMessage } from "../business/amqp-message";

export type RabbitMQQueueOptions<T> = {
  readonly name: string;
  readonly autodelete?: boolean;
  readonly deadLetterExchange?: string;
  readonly deadLetterRoutingKey?: string;
  readonly durable?: boolean;
  readonly exclusive?: boolean;
  readonly expires?: number;
  readonly maxLength?: number;
  readonly maxPriority?: number;
  readonly messageTtl?: number;
  readonly onMessage: (msg: AMQPMessage<T>) => Promise<void>;
  readonly queue: Replies.AssertQueue;
};
