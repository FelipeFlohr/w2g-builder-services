import { AMQPExchangeTypeEnum } from "../types/amqp-exchange-type.enum";

export interface AMQPExchange {
  readonly name: string;
  readonly type: AMQPExchangeTypeEnum;
  readonly autoDelete?: boolean;
  readonly durable?: boolean;
  readonly internal?: boolean;
}
