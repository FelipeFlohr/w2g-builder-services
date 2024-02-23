import { Controller, Get, Inject, Query, Res, StreamableFile } from "@nestjs/common";
import { VideoNotFoundError } from "../errors/video-not-found.error";
import { DownloaderService } from "../services/downloader.service";
import { Response } from "express";

@Controller("video")
export class VideoController {
  public constructor(@Inject(DownloaderService) private readonly service: DownloaderService) {}

  @Get()
  public async getVideo(@Res({ passthrough: true }) res: Response, @Query("url") url?: string) {
    if (url == undefined || url.trim() == "") {
      throw new VideoNotFoundError("");
    }

    const video = await this.service.downloadVideo(url);
    res.set({
      "Content-Type": video.mimeType,
      "Content-Disposition": `attachment; filename="${video.filename}"`,
    });

    return new StreamableFile(video.stream);
  }
}
