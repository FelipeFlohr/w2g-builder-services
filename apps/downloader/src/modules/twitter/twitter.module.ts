import { Module } from "@nestjs/common";
import { TwitterService } from "./services/twitter.service";
import { YoutubeDlModule } from "../youtube-dl/youtube-dl.module";

@Module({
  providers: [TwitterService],
  imports: [YoutubeDlModule],
  exports: [TwitterService],
})
export class TwitterModule {}
