import { AMQPExchangeTypeEnum } from "src/amqp/types/amqp-exchange-type.enum";
import { AMQPExchange } from "../amqp-exchange";
import { Replies } from "amqplib";
import { RabbitMQExchangeOptions } from "src/amqp/types/rabbitmq-exchange-options.type";

export class RabbitMQExchangeImpl implements AMQPExchange {
  public readonly name: string;
  public readonly type: AMQPExchangeTypeEnum;
  public readonly autoDelete?: boolean;
  public readonly durable?: boolean;
  public readonly internal?: boolean;
  private readonly exchange: Replies.AssertExchange;

  public constructor(options: RabbitMQExchangeOptions) {
    this.name = options.name;
    this.type = options.type;
    this.autoDelete = options.autoDelete;
    this.durable = options.durable;
    this.internal = options.internal;
    this.exchange = options.exchange;
  }
}
