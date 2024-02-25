import { Inject, Injectable, Logger } from "@nestjs/common";
import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoDownloader } from "src/modules/downloader/models/video-downloader";
import { VideoFileDTO } from "src/modules/downloader/models/video-file.dto";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { YoutubeDlService } from "src/modules/youtube-dl/services/youtube-dl.service";
import { LoggerUtils } from "src/utils/logger-utils";
import { InstagramVideoMetadataDTO } from "../models/instagram-video-metadata.dto";

@Injectable()
export class InstagramService extends VideoDownloader {
  public override platform: SocialMediaEnum = SocialMediaEnum.INSTAGRAM;
  protected override logger: Logger = LoggerUtils.from(InstagramService);
  private readonly instagramPrefixes = ["https://instagram.com", "https://www.instagram.com"] as const;

  public constructor(@Inject(YoutubeDlService) private readonly youtubeDlService: YoutubeDlService) {
    super();
  }

  public override async download(url: string): Promise<VideoFileDTO> {
    return await this.youtubeDlService.download(url, this.platform);
  }

  public override async getMetadata(url: string): Promise<VideoMetadataDTO> {
    return await this.youtubeDlService.getMetadata(url, InstagramVideoMetadataDTO, this.platform);
  }

  public override isDownloadableVideo(url: string): boolean {
    return this.validateVideoIsDownloadable(this.instagramPrefixes, url);
  }
}
