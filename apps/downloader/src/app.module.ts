import { Module } from "@nestjs/common";
import { VideoController } from "./modules/downloader/controllers/video.controller";
import { DownloaderModule } from "./modules/downloader/downloader.module";
import { EnvironmentModule } from "./env/environment.module";
import { YoutubeModule } from "./modules/youtube/youtube.module";

@Module({
  imports: [DownloaderModule, YoutubeModule, EnvironmentModule],
  controllers: [VideoController],
  providers: [],
})
export class AppModule {}
