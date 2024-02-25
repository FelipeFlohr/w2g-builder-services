import { Inject, Injectable, Logger } from "@nestjs/common";
import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoDownloader } from "src/modules/downloader/models/video-downloader";
import { VideoFileDTO } from "src/modules/downloader/models/video-file.dto";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { YoutubeDlService } from "src/modules/youtube-dl/services/youtube-dl.service";
import { LoggerUtils } from "src/utils/logger-utils";
import { TwitterVideoMetadataDTO } from "../models/twitter-video-metadata.dto";
import { URLUtils } from "src/utils/url-utils";

@Injectable()
export class TwitterService extends VideoDownloader {
  public readonly platform: SocialMediaEnum = SocialMediaEnum.TWITTER;
  protected override logger: Logger = LoggerUtils.from(TwitterService);
  private readonly twitterPrefixes = [
    "https://x.com",
    "https://www.x.com",
    "https://twitter.com",
    "https://www.twtiter.com",
  ] as const;

  public constructor(@Inject(YoutubeDlService) private readonly youtubeDlService: YoutubeDlService) {
    super();
  }

  public async download(url: string): Promise<VideoFileDTO> {
    url = URLUtils.removeQueryParams(url);
    return this.youtubeDlService.download(url, this.platform);
  }

  public override getMetadata(url: string): Promise<VideoMetadataDTO> {
    url = URLUtils.removeQueryParams(url);
    return this.youtubeDlService.getMetadata(url, TwitterVideoMetadataDTO, this.platform);
  }

  public isDownloadableVideo(url: string): boolean {
    return this.validateVideoIsDownloadable(this.twitterPrefixes, url);
  }
}
