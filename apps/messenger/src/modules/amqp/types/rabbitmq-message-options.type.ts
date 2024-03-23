import { ConsumeMessage } from "amqplib";

export type RabbitMQMessageOptions<T> = {
  readonly content: T;
  readonly consumerTag: string;
  readonly deliveryTag: number;
  readonly exchange: string;
  readonly redelivered: boolean;
  readonly routingKey: string;
  readonly message: ConsumeMessage;
};
