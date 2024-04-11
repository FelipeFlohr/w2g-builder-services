export type VideoMetadataType = {
  readonly title: string;
  readonly description?: string;
  readonly uploaderName: string;
  readonly views?: number;
  readonly likes?: number;
  readonly url: string;
  readonly length: number;
  readonly lengthString: string;
  readonly platform: string;
};
