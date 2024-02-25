import { Inject, Injectable } from "@nestjs/common";
import { DownloaderService } from "../downloader.service";
import { VideoFileDTO } from "../../models/video-file.dto";
import { DownloadersArrayProvider } from "../../providers/downloaders-array.provider";
import { VideoNotFoundError } from "../../errors/video-not-found.error";
import { VideoDownloader } from "../../models/video-downloader";
import { VideoMetadataDTO } from "../../models/video-metadata.dto";

@Injectable()
export class DownloaderServiceImpl implements DownloaderService {
  public constructor(@Inject(DownloadersArrayProvider) private readonly downloaders: Array<VideoDownloader>) {}

  public async downloadVideo(url: string): Promise<VideoFileDTO> {
    const downloader = this.findDownloader(url);
    return await downloader.download(url);
  }

  public async getVideoMetadata(url: string): Promise<VideoMetadataDTO> {
    const downloader = this.findDownloader(url);
    return await downloader.getMetadata(url);
  }

  private findDownloader(url: string): VideoDownloader {
    const downloader = this.downloaders.find((downloader) => downloader.isDownloadableVideo(url));
    if (downloader == undefined) {
      throw new VideoNotFoundError(url);
    }

    return downloader;
  }
}
