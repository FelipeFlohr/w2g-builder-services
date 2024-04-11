import { VideoMetadataDTO } from "../../../models/video-metadata.dto";
import { VideoReferenceDTO } from "../../../models/video-reference.dto";

export interface VisualizerService {
  getVideoReferences(guildId: string, channelId: string): Promise<Array<VideoReferenceDTO>>;
  getVideoMetadata(url: string): Promise<VideoMetadataDTO | undefined>;
}
