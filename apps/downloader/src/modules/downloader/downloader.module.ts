import { Module } from "@nestjs/common";
import { VideoController } from "./controllers/video.controller";
import { DownloaderServiceImpl } from "./services/impl/downloader.impl.service";
import { DownloaderService } from "./services/downloader.service";
import { YoutubeModule } from "../youtube/youtube.module";
import { DownloadersArrayProvider } from "./providers/downloaders-array.provider";
import { YoutubeService } from "../youtube/services/youtube.service";

@Module({
  controllers: [VideoController],
  providers: [
    {
      provide: DownloaderService,
      useClass: DownloaderServiceImpl,
    },
    {
      provide: DownloadersArrayProvider,
      useFactory: (downloader1) => [downloader1],
      inject: [YoutubeService],
    },
  ],
  imports: [YoutubeModule],
  exports: [DownloaderService],
})
export class DownloaderModule {}
