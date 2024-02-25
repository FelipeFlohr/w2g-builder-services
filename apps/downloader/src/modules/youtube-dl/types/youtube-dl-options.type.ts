import { VideoMetadataConvertable } from "src/modules/downloader/interfaces/video-metadata-convertable.interface";

export type YoutubeDlOptionsType<O, R extends VideoMetadataConvertable> = {
  new (options: O): R;
};
