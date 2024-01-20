import { RabbitMQBindingOptions } from "src/amqp/types/rabbitmq-binding-options.type";
import { AMQPBinding } from "../amqp-binding";
import { AMQPExchange } from "../amqp-exchange";
import { AMQPQueue } from "../amqp-queue";

export class RabbitMQBindingImpl<T> implements AMQPBinding<T> {
  public readonly queue: AMQPQueue<T>;
  public readonly exchange: AMQPExchange;
  public readonly pattern?: string;

  public constructor(options: RabbitMQBindingOptions<T>) {
    this.queue = options.queue;
    this.exchange = options.exchange;
    this.pattern = options.pattern;
  }
}
