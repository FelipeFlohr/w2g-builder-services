import { Module } from "@nestjs/common";
import { VideoController } from "./controllers/video.controller";
import { DownloaderServiceImpl } from "./services/impl/downloader.impl.service";
import { DownloaderService } from "./services/downloader.service";
import { YoutubeModule } from "../youtube/youtube.module";
import { DownloadersArrayProvider } from "./providers/downloaders-array.provider";
import { YoutubeService } from "../youtube/services/youtube.service";
import { TwitterModule } from "../twitter/twitter.module";
import { TwitterService } from "../twitter/services/twitter.service";
import { InstagramService } from "../instagram/services/instagram.service";
import { InstagramModule } from "../instagram/instagram.module";

@Module({
  controllers: [VideoController],
  providers: [
    {
      provide: DownloaderService,
      useClass: DownloaderServiceImpl,
    },
    {
      provide: DownloadersArrayProvider,
      useFactory: (downloader1, downloader2, downloader3) => [downloader1, downloader2, downloader3],
      inject: [YoutubeService, TwitterService, InstagramService],
    },
  ],
  imports: [YoutubeModule, TwitterModule, InstagramModule],
  exports: [DownloaderService],
})
export class DownloaderModule {}
