import { Inject } from "@nestjs/common";
import { ClassType } from "src/utils/types/class.type";
import { ObjectLiteral, Repository } from "typeorm";
import { DatabaseServiceProvider } from "../../providers/database-service.provider";
import { DatabaseService } from "../../services/database.service";
import { DatabaseServiceImpl } from "../../services/impl/database.impl.service";
import { MessengerBaseEntity } from "../messenger-base.entity";
import { MessengerBaseRepository } from "../messenger-base.repository";

export abstract class MessengerBaseTypeORMRepository<T extends MessengerBaseEntity<T>>
  implements MessengerBaseRepository<T>
{
  public readonly clazz: ClassType<T>;
  protected readonly databaseService: DatabaseServiceImpl;

  protected constructor(@Inject(DatabaseServiceProvider) databaseService: DatabaseService, clazz: ClassType<T>) {
    this.databaseService = databaseService as DatabaseServiceImpl;
    this.clazz = clazz;
  }

  public abstract getById(id: number): Promise<T | undefined>;
  public abstract deleteById(id: number): Promise<number | undefined>;
  public abstract existsById(id: number): Promise<boolean>;

  protected getRepository(): Repository<T>;
  protected getRepository<U extends ObjectLiteral>(clazz: ClassType<U>): Repository<U>;
  protected getRepository<U extends ObjectLiteral>(clazz?: ClassType<U>): Repository<T> | Repository<U> {
    if (clazz) {
      return this.databaseService.datasource.getRepository(clazz);
    }
    return this.databaseService.datasource.getRepository(this.clazz);
  }
}
