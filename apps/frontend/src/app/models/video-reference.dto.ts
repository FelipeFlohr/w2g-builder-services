export class VideoReferenceDTO {
  public readonly discordMessageId: string;
  public readonly discordMessageUrl: string;
  public readonly messageContent: string;
  public readonly messageUrlContent?: string;
  public readonly messageCreatedAt: Date;
  public readonly fileStorageHashId?: string;
  public readonly logBody?: string;

  public constructor(info: VideoReferenceDTO) {
    this.discordMessageId = info.discordMessageId;
    this.discordMessageUrl = info.discordMessageUrl;
    this.messageContent = info.messageContent;
    this.messageUrlContent = info.messageUrlContent;
    this.messageCreatedAt =
      typeof info.messageCreatedAt === "string" ? new Date(info.messageCreatedAt) : info.messageCreatedAt;
    this.fileStorageHashId = info.fileStorageHashId;
    this.logBody = info.logBody;
  }
}
