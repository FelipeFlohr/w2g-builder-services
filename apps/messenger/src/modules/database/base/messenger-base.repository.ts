import { ClassType } from "src/utils/types/class.type";
import { MessengerBaseEntity } from "./messenger-base.entity";

export interface MessengerBaseRepository<T extends MessengerBaseEntity<T>> {
  readonly clazz: ClassType<T>;
  getById(id: number): Promise<T | undefined>;
  deleteById(id: number): Promise<number | undefined>;
  existsById(id: number): Promise<boolean>;
}
