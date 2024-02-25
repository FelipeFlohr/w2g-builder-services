import { Inject, Injectable } from "@nestjs/common";
import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoFileDTO } from "src/modules/downloader/models/video-file.dto";
import { LoggerUtils } from "src/utils/logger-utils";
import { VideoDownloader } from "src/modules/downloader/models/video-downloader";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { YoutubeVideoMetadataDTO } from "../models/youtube-video-metadata.dto";
import { YoutubeDlService } from "src/modules/youtube-dl/services/youtube-dl.service";

@Injectable()
export class YoutubeService extends VideoDownloader {
  public override readonly platform: SocialMediaEnum = SocialMediaEnum.YOUTUBE;
  protected override readonly logger = LoggerUtils.from(YoutubeService);
  private readonly youtubeDlService: YoutubeDlService;
  private readonly youtubePrefixes = [
    "https://youtu.be",
    "https://www.youtu.be",
    "https://youtube.com",
    "https://www.youtube.com",
  ] as const;

  public constructor(@Inject(YoutubeDlService) youtubeDlService: YoutubeDlService) {
    super();
    this.youtubeDlService = youtubeDlService;
  }

  public override async getMetadata(url: string): Promise<VideoMetadataDTO> {
    return await this.youtubeDlService.getMetadata(url, YoutubeVideoMetadataDTO, this.platform);
  }

  public override async download(url: string): Promise<VideoFileDTO> {
    return await this.youtubeDlService.download(url, this.platform);
  }

  public override isDownloadableVideo(url: string): boolean {
    return this.validateVideoIsDownloadable(this.youtubePrefixes, url);
  }
}
