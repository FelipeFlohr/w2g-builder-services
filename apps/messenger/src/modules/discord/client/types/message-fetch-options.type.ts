export type MessageFetchOptions = {
  readonly after?: string;
  readonly around?: string;
  readonly before?: string;
  readonly limit?: number;
  readonly guildId: string;
  readonly channelId: string;
};
