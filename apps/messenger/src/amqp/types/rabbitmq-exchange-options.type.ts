import { Replies } from "amqplib";
import { AMQPExchangeTypeEnum } from "./amqp-exchange-type.enum";

export type RabbitMQExchangeOptions = {
  readonly name: string;
  readonly type: AMQPExchangeTypeEnum;
  readonly autoDelete?: boolean;
  readonly durable?: boolean;
  readonly internal?: boolean;
  readonly exchange: Replies.AssertExchange;
};
