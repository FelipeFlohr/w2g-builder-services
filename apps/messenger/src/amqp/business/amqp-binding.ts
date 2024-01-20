import { AMQPExchange } from "./amqp-exchange";
import { AMQPQueue } from "./amqp-queue";

export interface AMQPBinding<T> {
  readonly queue: AMQPQueue<T>;
  readonly exchange: AMQPExchange;
  readonly pattern?: string;
}
