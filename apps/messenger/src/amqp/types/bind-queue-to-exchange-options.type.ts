import { AMQPExchange } from "../business/amqp-exchange";
import { AMQPQueue } from "../business/amqp-queue";

export type BindQueueToExchangeOptions = {
  readonly queue: AMQPQueue;
  readonly exchange: AMQPExchange;
  readonly pattern?: string;
};
