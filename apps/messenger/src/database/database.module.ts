import { Global, Module } from "@nestjs/common";
import { DatabaseService } from "./database.service";
import { DatabaseServiceImpl } from "./impl/database.impl.service";

@Global()
@Module({
  providers: [
    {
      provide: DatabaseService,
      useClass: DatabaseServiceImpl,
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
