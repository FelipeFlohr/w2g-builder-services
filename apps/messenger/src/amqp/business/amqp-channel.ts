import { AssertExchangeOptions } from "../types/assert-exchange-options.type";
import { AssertQueueOptions } from "../types/assert-queue-options.type";
import { BindQueueToExchangeOptions } from "../types/bind-queue-to-exchange-options.type";
import { AMQPBinding } from "./amqp-binding";
import { AMQPExchange } from "./amqp-exchange";
import { AMQPQueue } from "./amqp-queue";

export interface AMQPChannel {
  readonly confirm?: boolean;
  readonly jsonSerialization?: boolean;
  readonly name?: string;
  readonly publishTimeoutMs?: number;
  assertQueue<T>(options: AssertQueueOptions<T>): Promise<AMQPQueue<T>>;
  assertExchange(options: AssertExchangeOptions): Promise<AMQPExchange>;
  bindQueueToExchange<T>(
    options: BindQueueToExchangeOptions<T>,
  ): Promise<AMQPBinding<T>>;
}
