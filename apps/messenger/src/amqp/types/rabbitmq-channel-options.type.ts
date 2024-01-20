import { Channel } from "amqp-connection-manager";

export type RabbitMQChannelOptions = {
  readonly confirm?: boolean;
  readonly jsonSerialization?: boolean;
  readonly name?: string;
  readonly publishTimeoutMs?: number;
  readonly channel: Channel;
};
