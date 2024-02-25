import { JsonProperty } from "src/modules/json-serialization/decorators/json-property/json-property.decorator";
import { TwitterVideoMetadataDTOOptions } from "../types/twitter-video-metadata-dto.options";
import { TypeUtils } from "src/utils/type-utils";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoMetadataConvertable } from "src/modules/downloader/interfaces/video-metadata-convertable.interface";

export class TwitterVideoMetadataDTO implements VideoMetadataConvertable {
  public readonly id: string;
  public readonly title: string;
  public readonly description: string;
  public readonly uploader: string;
  @JsonProperty("uploader_id") public readonly uploaderId: string;
  @JsonProperty("uploader_url") public readonly uploaderUrl: string;
  @JsonProperty("like_count") public readonly likeCount: number;
  @JsonProperty("repost_count") public readonly repostCount: number;
  @JsonProperty("comment_count") public readonly commentCount: number;
  @JsonProperty("age_limit") public readonly ageLimit: number;
  @JsonProperty("view_count") public readonly viewCount?: number;
  public readonly duration: number;
  @JsonProperty("webpage_url") public readonly webpageUrl: string;
  public readonly thumbnail: string;
  @JsonProperty("duraiton_string") public readonly durationString: string;

  public constructor(options: TwitterVideoMetadataDTOOptions) {
    this.id = options.id;
    this.title = options.title;
    this.description = options.description;
    this.uploader = options.uploader;
    this.uploaderId = options.uploaderId;
    this.uploaderUrl = options.uploaderUrl;
    this.likeCount = options.likeCount;
    this.repostCount = options.repostCount;
    this.commentCount = options.commentCount;
    this.ageLimit = options.ageLimit;
    this.viewCount = TypeUtils.parseNullToUndefined(options.viewCount);
    this.duration = options.duration;
    this.webpageUrl = options.webpageUrl;
    this.thumbnail = options.thumbnail;
    this.durationString = options.durationString;
  }

  public toVideoMetadataDTO(): VideoMetadataDTO {
    return new VideoMetadataDTO({
      length: this.duration,
      lengthString: this.durationString,
      title: this.title,
      uploaderName: this.uploader,
      platform: SocialMediaEnum.TWITTER,
      url: this.webpageUrl,
      description: this.description,
      likes: this.likeCount,
      views: this.viewCount,
    });
  }
}
