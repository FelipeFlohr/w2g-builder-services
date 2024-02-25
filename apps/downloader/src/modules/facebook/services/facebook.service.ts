import { Inject, Injectable, Logger } from "@nestjs/common";
import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoDownloader } from "src/modules/downloader/models/video-downloader";
import { VideoFileDTO } from "src/modules/downloader/models/video-file.dto";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { YoutubeDlService } from "src/modules/youtube-dl/services/youtube-dl.service";
import { LoggerUtils } from "src/utils/logger-utils";
import { FacebookVideoMetadataDTO } from "../models/facebook-video-metadata.dto";

@Injectable()
export class FacebookService extends VideoDownloader {
  public override readonly platform: SocialMediaEnum = SocialMediaEnum.FACEBOOK;
  protected override readonly logger: Logger = LoggerUtils.from(FacebookService);
  private readonly facebookPrefixes = [
    "https://www.facebook.com",
    "https://facebook.com",
    "https://m.facebook",
    "https://www.m.facebook",
    "https://www.fb.watch",
    "https://fb.watch",
  ] as const;

  public constructor(@Inject(YoutubeDlService) private readonly youtubeDlService: YoutubeDlService) {
    super();
  }

  public override async download(url: string): Promise<VideoFileDTO> {
    return await this.youtubeDlService.download(url, this.platform);
  }

  public override async getMetadata(url: string): Promise<VideoMetadataDTO> {
    return await this.youtubeDlService.getMetadata(url, FacebookVideoMetadataDTO, this.platform);
  }

  public override isDownloadableVideo(url: string): boolean {
    return this.validateVideoIsDownloadable(this.facebookPrefixes, url);
  }
}
