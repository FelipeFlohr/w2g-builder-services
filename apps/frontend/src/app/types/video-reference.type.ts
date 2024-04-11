export type VideoReferenceType = {
  readonly discordMessageId: string;
  readonly discordMessageUrl: string;
  readonly messageContent: string;
  readonly messageUrlContent?: string;
  readonly messageCreatedAt: Date;
  readonly fileStorageHashId?: string;
  readonly logBody?: string;
};
