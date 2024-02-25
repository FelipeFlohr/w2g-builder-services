import { Module } from "@nestjs/common";
import { InstagramService } from "./services/instagram.service";
import { YoutubeDlModule } from "../youtube-dl/youtube-dl.module";

@Module({
  providers: [InstagramService],
  imports: [YoutubeDlModule],
  exports: [InstagramService],
})
export class InstagramModule {}
