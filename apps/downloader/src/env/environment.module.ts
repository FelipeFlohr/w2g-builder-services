import { Global, Module } from "@nestjs/common";
import { EnvironmentService } from "./services/environment.service";

@Global()
@Module({
  providers: [
    {
      provide: EnvironmentService,
      useValue: EnvironmentService.getInstance(),
    },
  ],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
