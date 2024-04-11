import { Injectable, inject } from "@angular/core";
import { VideoMetadataDTO } from "../../../../models/video-metadata.dto";
import { VideoReferenceDTO } from "../../../../models/video-reference.dto";
import { BuilderHttpService } from "../../../../services/builder-http.service";
import { DownloaderHttpService } from "../../../../services/downloader-http.service";
import { VideoMetadataType } from "../../../../types/video-metadata.type";
import { VideoReferenceType } from "../../../../types/video-reference.type";
import { VisualizerRoutes } from "../../data/visualizer-routes";
import { VisualizerService } from "../visualizer.service";

@Injectable({
  providedIn: "root",
})
export class VisualizerServiceImpl implements VisualizerService {
  private readonly builderHttpService = inject(BuilderHttpService);
  private readonly downloaderHttpService = inject(DownloaderHttpService);

  public async getVideoReferences(guildId: string, channelId: string): Promise<VideoReferenceDTO[]> {
    const data = await this.builderHttpService.get<Array<VideoReferenceType>>(
      VisualizerRoutes.getVideoReferencesRoute(guildId, channelId),
    );
    return data
      .map((d) => new VideoReferenceDTO(d))
      .sort((a, b) => a.messageCreatedAt.getTime() - b.messageCreatedAt.getTime());
  }

  public async getVideoMetadata(url: string): Promise<VideoMetadataDTO | undefined> {
    try {
      const metadataOptions = await this.downloaderHttpService.get<VideoMetadataType>(
        VisualizerRoutes.getVideoMetadataRoute(url),
      );
      return new VideoMetadataDTO(metadataOptions);
    } catch (e) {
      console.error(e);
      return;
    }
  }
}
