import { AMQPMessage } from "./amqp-message";

export interface AMQPQueue<T> {
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
}
