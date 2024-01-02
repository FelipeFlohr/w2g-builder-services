export type DiscordGuildInfoDTOOptions = {
  readonly id: string;
  readonly verified: boolean;
  readonly createdAt: Date;
  readonly iconPngUrl?: string;
  readonly iconJpegUrl?: string;
  readonly iconGifUrl?: string;
};
