import { JsonProperty } from "src/modules/json-serialization/decorators/json-property/json-property.decorator";
import { YoutubeVideoMetadataDTOOptions } from "../types/youtube-video-metadata-dto.options";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoMetadataConvertable } from "src/modules/downloader/interfaces/video-metadata-convertable.interface";

export class YoutubeVideoMetadataDTO implements VideoMetadataConvertable {
  public readonly id: string;
  public readonly title: string;
  public readonly thumbnail: string;
  public readonly description: string;
  @JsonProperty("channel_id") public readonly channelId: string;
  @JsonProperty("channel_url") public readonly channelUrl: string;
  public readonly duration: number;
  @JsonProperty("view_count") public readonly viewCount: number;
  @JsonProperty("webpage_url") public readonly webpageUrl: string;
  @JsonProperty("playable_in_embed") public readonly playableInEmbed: boolean;
  @JsonProperty("comment_count") public readonly commentCount: number;
  @JsonProperty("like_count") public readonly likeCount: number;
  public readonly channel: string;
  @JsonProperty("channel_follower_count") public readonly channelFollowerCount: number;
  @JsonProperty("fulltitle") public readonly fullTitle: string;
  @JsonProperty("duration_string") public readonly durationString: string;

  public constructor(options: YoutubeVideoMetadataDTOOptions) {
    this.id = options.id;
    this.title = options.title;
    this.thumbnail = options.thumbnail;
    this.description = options.description;
    this.channelId = options.channelId;
    this.channelUrl = options.channelUrl;
    this.duration = options.duration;
    this.viewCount = options.viewCount;
    this.webpageUrl = options.webpageUrl;
    this.playableInEmbed = options.playableInEmbed;
    this.commentCount = options.commentCount;
    this.likeCount = options.likeCount;
    this.channel = options.channel;
    this.channelFollowerCount = options.channelFollowerCount;
    this.fullTitle = options.fullTitle;
    this.durationString = options.durationString;
  }

  public toVideoMetadataDTO(): VideoMetadataDTO {
    return new VideoMetadataDTO({
      length: this.duration,
      lengthString: this.durationString,
      title: this.fullTitle,
      uploaderName: this.channel,
      url: this.webpageUrl,
      description: this.description,
      likes: this.likeCount,
      views: this.viewCount,
      platform: SocialMediaEnum.YOUTUBE,
    });
  }
}
