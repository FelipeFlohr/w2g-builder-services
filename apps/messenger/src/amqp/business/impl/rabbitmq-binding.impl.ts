import { RabbitMQBindingOptions } from "src/amqp/types/rabbitmq-binding-options.type";
import { AMQPBinding } from "../amqp-binding";
import { AMQPExchange } from "../amqp-exchange";
import { AMQPQueue } from "../amqp-queue";

export class RabbitMQBindingImpl implements AMQPBinding {
  public readonly queue: AMQPQueue;
  public readonly exchange: AMQPExchange;
  public readonly pattern?: string;

  public constructor(options: RabbitMQBindingOptions) {
    this.queue = options.queue;
    this.exchange = options.exchange;
    this.pattern = options.pattern;
  }
}
