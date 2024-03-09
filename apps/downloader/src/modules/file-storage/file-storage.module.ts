import { Module } from "@nestjs/common";
import { FileStorageServiceImpl } from "./services/impl/file-storage.impl.service";
import { EnvironmentModule } from "src/env/environment.module";
import { FileStorageService } from "./services/file-storage.service";

@Module({
  providers: [
    {
      provide: FileStorageService,
      useClass: FileStorageServiceImpl,
    },
  ],
  imports: [EnvironmentModule],
  exports: [FileStorageService],
})
export class FileStorageModule {}
