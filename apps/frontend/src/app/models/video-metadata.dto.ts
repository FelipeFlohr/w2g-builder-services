import { VideoMetadataType } from "../types/video-metadata.type";

export class VideoMetadataDTO {
  public readonly title: string;
  public readonly description?: string;
  public readonly uploaderName: string;
  public readonly views?: number;
  public readonly likes?: number;
  public readonly url: string;
  public readonly length: number;
  public readonly lengthString: string;
  public readonly platform: string;

  public constructor(metadata: VideoMetadataType) {
    this.title = metadata.title;
    this.description = metadata.description;
    this.uploaderName = metadata.uploaderName;
    this.views = metadata.views;
    this.likes = metadata.likes;
    this.url = metadata.url;
    this.length = metadata.length;
    this.lengthString = metadata.lengthString;
    this.platform = metadata.platform;
  }
}
