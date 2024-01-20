import { ConsumeMessage } from "amqplib";
import { AMQPMessage } from "../amqp-message";
import { RabbitMQMessageOptions } from "src/amqp/types/rabbitmq-message-options.type";

export class RabbitMQMessageImpl<T> implements AMQPMessage<T> {
  public readonly content: T;
  public readonly consumerTag: string;
  public readonly deliveryTag: number;
  public readonly exchange: string;
  public readonly redelivered: boolean;
  public readonly routingKey: string;
  private readonly message: ConsumeMessage;

  public constructor(options: RabbitMQMessageOptions<T>) {
    this.content = options.content;
    this.consumerTag = options.consumerTag;
    this.deliveryTag = options.deliveryTag;
    this.exchange = options.exchange;
    this.redelivered = options.redelivered;
    this.routingKey = options.routingKey;
    this.message = options.message;
  }
}
