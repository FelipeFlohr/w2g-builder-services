import { VideoFileDTO } from "../models/video-file.dto";

export interface DownloaderService {
  downloadVideo(url: string): Promise<VideoFileDTO>;
}

export const DownloaderService = Symbol("DownloaderService");
