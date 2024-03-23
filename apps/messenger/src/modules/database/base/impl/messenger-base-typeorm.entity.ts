import { Column } from "typeorm";
import { PostgresTypesHelper } from "../../helpers/postgres-types.helper";
import { MessengerBaseEntity } from "../messenger-base.entity";

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

  public abstract equals(val: T): val is T;
}
