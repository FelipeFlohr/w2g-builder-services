import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoFileDTO } from "./video-file.dto";
import { Logger } from "@nestjs/common";
import { VideoMetadataDTO } from "./video-metadata.dto";

export abstract class VideoDownloader {
  public abstract readonly platform: SocialMediaEnum;
  public abstract download(url: string): Promise<VideoFileDTO>;
  public abstract getMetadata(url: string): Promise<VideoMetadataDTO>;
  public abstract isDownloadableVideo(url: string): boolean;
  protected abstract readonly logger: Logger;

  protected validateVideoIsDownloadable(prefixes: readonly string[], url: string): boolean {
    return prefixes.some((prefix) => url.trim().startsWith(prefix.trim()));
  }
}
