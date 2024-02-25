export type InstagramVideoMetadataDTOOptions = {
  readonly id: string;
  readonly title: string;
  readonly description?: string | null;
  readonly duration: number;
  readonly uploaderId: string;
  readonly uploader: string;
  readonly likeCount: number;
  readonly commentCount: number;
  readonly webpageUrl: string;
  readonly durationString: string;
};
