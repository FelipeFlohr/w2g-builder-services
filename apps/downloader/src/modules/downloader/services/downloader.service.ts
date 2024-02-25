import { VideoFileDTO } from "../models/video-file.dto";
import { VideoMetadataDTO } from "../models/video-metadata.dto";

export interface DownloaderService {
  downloadVideo(url: string): Promise<VideoFileDTO>;
  getVideoMetadata(url: string): Promise<VideoMetadataDTO>;
}

export const DownloaderService = Symbol("DownloaderService");
