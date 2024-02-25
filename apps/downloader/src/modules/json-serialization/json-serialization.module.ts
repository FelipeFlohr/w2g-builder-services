import { Module } from "@nestjs/common";
import { JsonSerializationService } from "./services/json-serialization.service";
import { JsonSerializationServiceImpl } from "./services/impl/json-serialization.impl.service";

@Module({
  providers: [
    {
      provide: JsonSerializationService,
      useClass: JsonSerializationServiceImpl,
    },
  ],
  exports: [JsonSerializationService],
})
export class JsonSerializationModule {}
