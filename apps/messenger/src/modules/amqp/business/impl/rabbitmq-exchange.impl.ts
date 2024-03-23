import { Replies } from "amqplib";
import { AMQPExchangeTypeEnum } from "../../enums/amqp-exchange-type.enum";
import { RabbitMQExchangeOptions } from "../../types/rabbitmq-exchange-options.type";
import { AMQPExchange } from "../amqp-exchange";

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
