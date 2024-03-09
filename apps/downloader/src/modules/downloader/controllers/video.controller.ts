import { DownloadVideoBatchDTO } from "../models/download-video-batch.dto";
import { VideoMetadataDTO } from "../models/video-metadata.dto";

export interface VideoController {
  processVideos(urls: Array<string>): Promise<DownloadVideoBatchDTO>;
  getMetadata(url: string): Promise<VideoMetadataDTO>;
}
