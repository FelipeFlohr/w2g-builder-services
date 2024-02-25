import { Module } from "@nestjs/common";
import { FacebookService } from "./services/facebook.service";
import { YoutubeDlModule } from "../youtube-dl/youtube-dl.module";

@Module({
  providers: [FacebookService],
  imports: [YoutubeDlModule],
  exports: [FacebookService],
})
export class FacebookModule {}
