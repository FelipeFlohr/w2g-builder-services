import { Inject, Injectable } from "@nestjs/common";
import { DownloaderService } from "../downloader.service";
import { VideoFileDTO } from "../../models/video-file.dto";
import { DownloadersArrayProvider } from "../../providers/downloaders-array.provider";
import { IVideoDownloader } from "../../interfaces/video-downloader.interface";
import { VideoNotFoundError } from "../../errors/video-not-found.error";

@Injectable()
export class DownloaderServiceImpl implements DownloaderService {
  public constructor(@Inject(DownloadersArrayProvider) private readonly downloaders: Array<IVideoDownloader>) {}

  public async downloadVideo(url: string): Promise<VideoFileDTO> {
    const downloader = this.downloaders.find((downloader) => downloader.isDownloadableVideo(url));
    if (downloader == undefined) {
      throw new VideoNotFoundError(url);
    }

    return await downloader.download(url);
  }
}
