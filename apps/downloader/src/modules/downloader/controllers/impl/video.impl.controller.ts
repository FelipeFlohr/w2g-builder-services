import { Body, Controller, Get, Inject, ParseArrayPipe, Post, Query } from "@nestjs/common";
import { DownloaderService } from "../../services/downloader.service";
import { VideoController } from "../video.controller";
import { DownloadVideoBatchDTO } from "../../models/download-video-batch.dto";
import { VideoNotFoundError } from "../../errors/video-not-found.error";

@Controller("video")
export class VideoControllerImpl implements VideoController {
  public constructor(@Inject(DownloaderService) private readonly service: DownloaderService) {}

  @Post()
  public async processVideos(@Body(ParseArrayPipe) urls: Array<string>): Promise<DownloadVideoBatchDTO> {
    const urlsParsed = urls.filter((url) => typeof url === "string");
    return await this.service.downloadVideos(urlsParsed);
  }

  @Get("/metadata")
  public async getMetadata(@Query("url") url?: string) {
    if (url == undefined || url.trim() == "") {
      throw new VideoNotFoundError("");
    }
    return await this.service.getVideoMetadata(url);
  }
}
