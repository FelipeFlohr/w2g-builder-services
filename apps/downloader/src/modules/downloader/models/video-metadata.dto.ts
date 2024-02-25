import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoMetadataDTOOptions } from "../types/video-metadata-dto.options";

export class VideoMetadataDTO {
  public readonly title: string;
  public readonly description?: string;
  public readonly uploaderName: string;
  public readonly views?: number;
  public readonly likes?: number;
  public readonly url: string;
  public readonly length: number;
  public readonly lengthString: string;
  public readonly platform: SocialMediaEnum;

  public constructor(options: VideoMetadataDTOOptions) {
    this.title = options.title;
    this.description = options.description;
    this.uploaderName = options.uploaderName;
    this.views = options.views;
    this.likes = options.likes;
    this.url = options.url;
    this.length = options.length;
    this.lengthString = options.lengthString;
    this.platform = options.platform;
  }
}
