import { AMQPExchangeTypeEnum } from "../enums/amqp-exchange-type.enum";

export type AssertExchangeOptions = {
  readonly name: string;
  readonly type: AMQPExchangeTypeEnum;
  readonly autoDelete?: boolean;
  readonly durable?: boolean;
  readonly internal?: boolean;
};
