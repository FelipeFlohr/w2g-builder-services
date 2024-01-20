import { AMQPChannel } from "../business/amqp-channel";

export interface AMQPService {
  readonly channel: AMQPChannel;
}

export const AMQPService = Symbol("AMQPService");
