import { Repository } from "typeorm";
import { MessengerBaseEntity } from "../messenger-base.entity";
import { MessengerBaseRepository } from "../messenger-base.repository";
import { DatabaseServiceImpl } from "src/database/impl/database.impl.service";
import { Inject } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { ClassType } from "src/utils/type-utils";

export abstract class MessengerBaseTypeORMRepository<
  T extends MessengerBaseEntity,
> implements MessengerBaseRepository<T>
{
  public readonly clazz: ClassType<T>;
  protected readonly databaseService: DatabaseServiceImpl;

  protected constructor(
    @Inject(DatabaseService) databaseService: DatabaseService,
    clazz: ClassType<T>,
  ) {
    this.databaseService = databaseService as DatabaseServiceImpl;
    this.clazz = clazz;
  }

  protected getRepository(): Repository<T> {
    return this.databaseService.datasource.getRepository(this.clazz);
  }
}
