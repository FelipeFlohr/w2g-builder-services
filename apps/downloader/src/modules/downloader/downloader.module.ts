import { Module } from "@nestjs/common";
import { VideoControllerImpl } from "./controllers/impl/video.impl.controller";
import { DownloaderServiceImpl } from "./services/impl/downloader.impl.service";
import { DownloaderService } from "./services/downloader.service";
import { YoutubeModule } from "../youtube/youtube.module";
import { DownloadersArrayProvider } from "./providers/downloaders-array.provider";
import { YoutubeService } from "../youtube/services/youtube.service";
import { TwitterModule } from "../twitter/twitter.module";
import { TwitterService } from "../twitter/services/twitter.service";
import { InstagramService } from "../instagram/services/instagram.service";
import { InstagramModule } from "../instagram/instagram.module";
import { FacebookService } from "../facebook/services/facebook.service";
import { FacebookModule } from "../facebook/facebook.module";
import { FileStorageModule } from "../file-storage/file-storage.module";

@Module({
  controllers: [VideoControllerImpl],
  providers: [
    {
      provide: DownloaderService,
      useClass: DownloaderServiceImpl,
    },
    {
      provide: DownloadersArrayProvider,
      useFactory: (...downloaders) => [...downloaders],
      inject: [YoutubeService, TwitterService, InstagramService, FacebookService],
    },
  ],
  imports: [YoutubeModule, TwitterModule, InstagramModule, FacebookModule, FileStorageModule],
  exports: [DownloaderService],
})
export class DownloaderModule {}
