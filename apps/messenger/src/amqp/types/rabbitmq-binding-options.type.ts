import { AMQPExchange } from "../business/amqp-exchange";
import { AMQPQueue } from "../business/amqp-queue";

export type RabbitMQBindingOptions<T> = {
  readonly queue: AMQPQueue<T>;
  readonly exchange: AMQPExchange;
  readonly pattern?: string;
};
