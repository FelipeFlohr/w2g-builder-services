import { Module } from "@nestjs/common";
import { VideoController } from "./modules/downloader/controllers/video.controller";
import { DownloaderModule } from "./modules/downloader/downloader.module";
import { EnvironmentModule } from "./env/environment.module";
import { YoutubeModule } from "./modules/youtube/youtube.module";
import { TwitterModule } from "./modules/twitter/twitter.module";
import { JsonSerializationModule } from "./modules/json-serialization/json-serialization.module";
import { YoutubeDlModule } from "./modules/youtube-dl/youtube-dl.module";
import { InstagramModule } from "./modules/instagram/instagram.module";

@Module({
  imports: [
    DownloaderModule,
    YoutubeModule,
    EnvironmentModule,
    TwitterModule,
    JsonSerializationModule,
    YoutubeDlModule,
    InstagramModule,
  ],
  controllers: [VideoController],
  providers: [],
})
export class AppModule {}
