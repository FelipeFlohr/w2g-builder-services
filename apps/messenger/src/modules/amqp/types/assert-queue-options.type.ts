export type AssertQueueOptions = {
  readonly name: string;
  readonly autodelete?: boolean;
  readonly deadLetterExchange?: string;
  readonly deadLetterRoutingKey?: string;
  readonly durable?: boolean;
  readonly exclusive?: boolean;
  readonly expires?: number;
  readonly maxLength?: number;
  readonly maxPriority?: number;
  readonly messageTtl?: number;
};
