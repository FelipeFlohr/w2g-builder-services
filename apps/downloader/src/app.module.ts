import { Module } from "@nestjs/common";
import { VideoControllerImpl } from "./modules/downloader/controllers/impl/video.impl.controller";
import { DownloaderModule } from "./modules/downloader/downloader.module";
import { EnvironmentModule } from "./env/environment.module";
import { YoutubeModule } from "./modules/youtube/youtube.module";
import { TwitterModule } from "./modules/twitter/twitter.module";
import { JsonSerializationModule } from "./modules/json-serialization/json-serialization.module";
import { YoutubeDlModule } from "./modules/youtube-dl/youtube-dl.module";
import { InstagramModule } from "./modules/instagram/instagram.module";
import { FacebookModule } from "./modules/facebook/facebook.module";
import { HealthcheckModule } from "./modules/healthcheck/healthcheck.module";
import { FileStorageModule } from "./modules/file-storage/file-storage.module";

@Module({
  imports: [
    DownloaderModule,
    YoutubeModule,
    EnvironmentModule,
    TwitterModule,
    JsonSerializationModule,
    YoutubeDlModule,
    InstagramModule,
    FacebookModule,
    HealthcheckModule,
    FileStorageModule,
  ],
  controllers: [VideoControllerImpl],
  providers: [],
})
export class AppModule {}
