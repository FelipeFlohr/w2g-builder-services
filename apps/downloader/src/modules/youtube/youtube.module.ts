import { Module } from "@nestjs/common";
import { YoutubeService } from "./services/youtube.service";

@Module({
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class YoutubeModule {}
