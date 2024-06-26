import { Module } from "@nestjs/common";
import { YoutubeService } from "./services/youtube.service";
import { YoutubeDlModule } from "../youtube-dl/youtube-dl.module";

@Module({
  providers: [YoutubeService],
  imports: [YoutubeDlModule],
  exports: [YoutubeService],
})
export class YoutubeModule {}
