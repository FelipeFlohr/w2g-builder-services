import { Column } from "typeorm";
import { MessengerBaseEntity } from "../messenger-base.entity";
import { PostgresTypesHelper } from "src/database/helpers/postgres-types.helper";

export abstract class MessengerBaseTypeORMEntity<T> implements MessengerBaseEntity<T> {
  @Column({
    name: "CREATED_AT",
    default: PostgresTypesHelper.CURRENT_TIMESTAMP_DEFAULT,
    type: "timestamp",
    nullable: false,
  })
  public createdAt: Date;

  @Column({
    name: "UPDATED_AT",
    default: PostgresTypesHelper.CURRENT_TIMESTAMP_DEFAULT,
    type: "timestamp",
    nullable: false,
  })
  public updatedAt: Date;

  @Column({
    name: "VERSION",
    default: 0,
    type: "integer",
    nullable: false,
  })
  public version: number;

  public abstract equals(val: T): boolean;
}
