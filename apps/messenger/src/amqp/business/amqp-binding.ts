import { AMQPExchange } from "./amqp-exchange";
import { AMQPQueue } from "./amqp-queue";

export interface AMQPBinding {
  readonly queue: AMQPQueue;
  readonly exchange: AMQPExchange;
  readonly pattern?: string;
}
