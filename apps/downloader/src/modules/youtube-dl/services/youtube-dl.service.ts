import { VideoMetadataConvertable } from "src/modules/downloader/interfaces/video-metadata-convertable.interface";
import { VideoMetadataDTO } from "src/modules/downloader/models/video-metadata.dto";
import { YoutubeDlOptionsType } from "../types/youtube-dl-options.type";
import { SocialMediaEnum } from "src/enums/social-media.enum";
import { VideoFileDTO } from "src/modules/downloader/models/video-file.dto";

export interface YoutubeDlService {
  getMetadata<O, R extends VideoMetadataConvertable>(
    url: string,
    metadataReturnTarget: YoutubeDlOptionsType<O, R>,
    platform: SocialMediaEnum,
  ): Promise<VideoMetadataDTO>;
  download(url: string, platform: SocialMediaEnum): Promise<VideoFileDTO>;
}

export const YoutubeDlService = Symbol("YoutubeDlService");
