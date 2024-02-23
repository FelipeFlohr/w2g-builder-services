import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoFileDTO } from "../models/video-file.dto";

export interface IVideoDownloader {
  readonly platform: SocialMediaEnum;
  download(url: string): Promise<VideoFileDTO>;
  isDownloadableVideo(url: string): boolean;
}
