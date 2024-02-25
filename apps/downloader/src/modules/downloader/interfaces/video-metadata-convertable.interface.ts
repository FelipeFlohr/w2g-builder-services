import { VideoMetadataDTO } from "../models/video-metadata.dto";

export interface VideoMetadataConvertable {
  toVideoMetadataDTO(): VideoMetadataDTO;
}
