export type TwitterVideoMetadataDTOOptions = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly uploader: string;
  readonly uploaderId: string;
  readonly uploaderUrl: string;
  readonly likeCount: number;
  readonly repostCount: number;
  readonly commentCount: number;
  readonly ageLimit: number;
  readonly viewCount?: number | null;
  readonly duration: number;
  readonly webpageUrl: string;
  readonly thumbnail: string;
  readonly durationString: string;
};
