import { Module } from "@nestjs/common";
import { YoutubeDlService } from "./services/youtube-dl.service";
import { YoutubeDlServiceImpl } from "./services/impl/youtube-dl.impl.service";
import { EnvironmentModule } from "src/env/environment.module";
import { JsonSerializationModule } from "../json-serialization/json-serialization.module";

@Module({
  providers: [
    {
      provide: YoutubeDlService,
      useClass: YoutubeDlServiceImpl,
    },
  ],
  imports: [EnvironmentModule, JsonSerializationModule],
  exports: [YoutubeDlService],
})
export class YoutubeDlModule {}
