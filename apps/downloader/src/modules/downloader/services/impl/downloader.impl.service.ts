import { Inject, Injectable } from "@nestjs/common";
import { DownloaderService } from "../downloader.service";
import { VideoFileDTO } from "../../models/video-file.dto";
import { DownloadersArrayProvider } from "../../providers/downloaders-array.provider";
import { VideoNotFoundError } from "../../errors/video-not-found.error";
import { VideoDownloader } from "../../models/video-downloader";
import { VideoMetadataDTO } from "../../models/video-metadata.dto";
import { DownloadVideoBatchDTO } from "../../models/download-video-batch.dto";
import PromisePool from "@supercharge/promise-pool";
import { FileStorageService } from "src/modules/file-storage/services/file-storage.service";
import { PersistedVideoOnFileStorageDTO } from "../../models/persisted-video-on-file-storage.dto";
import { DownloadFailureDTO } from "../../models/download-failure.dto";
import { LoggerUtils } from "src/utils/logger-utils";
import * as fs from "fs/promises";
import axios from "axios";

@Injectable()
export class DownloaderServiceImpl implements DownloaderService {
  private readonly logger = LoggerUtils.from(DownloaderServiceImpl);

  public constructor(
    @Inject(DownloadersArrayProvider) private readonly downloaders: Array<VideoDownloader>,
    @Inject(FileStorageService) private readonly fileStorageService: FileStorageService,
  ) {}

  public async downloadVideo(url: string): Promise<VideoFileDTO> {
    const downloader = this.findDownloader(url);
    return await downloader.download(url);
  }

  public async downloadVideos(urls: Array<string>): Promise<DownloadVideoBatchDTO> {
    const result = new DownloadVideoBatchDTO([], []);

    await PromisePool.withConcurrency(5)
      .for(urls)
      .process(async (url) => {
        let video: VideoFileDTO | undefined;
        try {
          const video = await this.downloadVideo(url);
          const savedVideo = await this.fileStorageService.saveVideo(video);
          const persistedVideoDTO = new PersistedVideoOnFileStorageDTO(
            url,
            savedVideo.fileHash,
            savedVideo.fileName,
            savedVideo.mimeType,
          );

          result.downloaded.push(persistedVideoDTO);
        } catch (e) {
          let error: Error | undefined;
          let message = `${e}`;
          if (axios.isAxiosError(e)) {
            error = e;
            message = `${e.response?.status}\n${JSON.stringify(e.response?.data)}\n${e.stack}`;
          } else if (e instanceof Error) {
            error = e;
            message = `${e}\n${e.stack}`;
          }

          if (video?.filePath) {
            await fs.unlink(video.filePath);
          }

          this.logger.error(e);
          const errorDTO = new DownloadFailureDTO(url, message, error);
          result.failed.push(errorDTO);
        }
      });

    return result;
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
