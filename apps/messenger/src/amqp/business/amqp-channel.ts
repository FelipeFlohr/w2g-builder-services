import { AssertExchangeOptions } from "../types/assert-exchange-options.type";
import { AssertQueueOptions } from "../types/assert-queue-options.type";
import { BindQueueToExchangeOptions } from "../types/bind-queue-to-exchange-options.type";
import { AMQPBinding } from "./amqp-binding";
import { AMQPExchange } from "./amqp-exchange";
import { AMQPMessage } from "./amqp-message";
import { AMQPQueue } from "./amqp-queue";

export interface AMQPChannel {
  readonly confirm?: boolean;
  readonly jsonSerialization?: boolean;
  readonly name?: string;
  readonly publishTimeoutMs?: number;
  assertQueue(options: AssertQueueOptions): Promise<AMQPQueue>;
  assertExchange(options: AssertExchangeOptions): Promise<AMQPExchange>;
  bindQueueToExchange(
    options: BindQueueToExchangeOptions,
  ): Promise<AMQPBinding>;
  listenQueue<T>(
    queue: AMQPQueue,
    onMessage: (msg: AMQPMessage<T>) => Promise<void>,
  ): Promise<void>;
  sendMessage<T>(queue: AMQPQueue, msg: T): Promise<void>;
  sendMessage<T>(
    exchange: AMQPExchange,
    routingKey: string,
    msg: T,
  ): Promise<void>;
}
