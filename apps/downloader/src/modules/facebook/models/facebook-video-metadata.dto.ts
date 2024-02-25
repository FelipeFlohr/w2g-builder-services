import { VideoMetadataConvertable } from "src/modules/downloader/interfaces/video-metadata-convertable.interface";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { JsonProperty } from "src/modules/json-serialization/decorators/json-property/json-property.decorator";
import { FacebookVideoMetadataDTOOptions } from "../types/facebook-video-metadata-dto.options";
import { SocialMediaEnum } from "src/enums/social-media.enum";

export class FacebookVideoMetadataDTO implements VideoMetadataConvertable {
  public readonly title: string;
  public readonly description: string;
  public readonly uploader: string;
  public readonly thumbnail: string;
  @JsonProperty("view_count") public readonly viewCount: number;
  public readonly duration: number;
  public readonly id: string;
  @JsonProperty("webpage_url") public readonly webpageUrl: string;
  @JsonProperty("duration_string") public readonly durationString: string;

  public constructor(options: FacebookVideoMetadataDTOOptions) {
    this.title = options.title;
    this.description = options.description;
    this.uploader = options.uploader;
    this.thumbnail = options.thumbnail;
    this.viewCount = options.viewCount;
    this.duration = options.duration;
    this.id = options.id;
    this.webpageUrl = options.webpageUrl;
    this.durationString = options.durationString;
  }

  public toVideoMetadataDTO(): VideoMetadataDTO {
    return new VideoMetadataDTO({
      length: this.duration,
      lengthString: this.durationString,
      platform: SocialMediaEnum.FACEBOOK,
      title: this.description,
      uploaderName: this.uploader,
      url: this.webpageUrl,
      description: undefined,
      likes: undefined,
      views: this.viewCount,
    });
  }
}
