import { VideoMetadataConvertable } from "src/modules/downloader/interfaces/video-metadata-convertable.interface";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { JsonProperty } from "src/modules/json-serialization/decorators/json-property/json-property.decorator";
import { InstagramVideoMetadataDTOOptions } from "../types/instagram-video-metadata-dto.options";
import { TypeUtils } from "src/utils/type-utils";
import { SocialMediaEnum } from "src/enums/social-media.enum";

export class InstagramVideoMetadataDTO implements VideoMetadataConvertable {
  public readonly id: string;
  public readonly title: string;
  public readonly description?: string;
  public readonly duration: number;
  @JsonProperty("uploader_id") public readonly uploaderId: string;
  public readonly uploader: string;
  @JsonProperty("like_count") public readonly likeCount: number;
  @JsonProperty("comment_count") public readonly commentCount: number;
  @JsonProperty("webpage_url") public readonly webpageUrl: string;
  @JsonProperty("duration_string") public readonly durationString: string;

  public constructor(options: InstagramVideoMetadataDTOOptions) {
    this.id = options.id;
    this.title = options.title;
    this.description = TypeUtils.parseNullToUndefined(options.description);
    this.duration = options.duration;
    this.uploaderId = options.uploaderId;
    this.uploader = options.uploader;
    this.likeCount = options.likeCount;
    this.commentCount = options.commentCount;
    this.webpageUrl = options.webpageUrl;
    this.durationString = options.durationString;
  }

  public toVideoMetadataDTO(): VideoMetadataDTO {
    return new VideoMetadataDTO({
      length: this.duration,
      lengthString: this.durationString,
      platform: SocialMediaEnum.INSTAGRAM,
      title: this.title,
      uploaderName: this.uploader,
      url: this.webpageUrl,
      description: this.description,
      likes: this.likeCount,
      views: undefined,
    });
  }
}
