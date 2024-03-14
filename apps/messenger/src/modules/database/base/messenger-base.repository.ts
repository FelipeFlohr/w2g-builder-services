import { ClassType } from "src/utils/types/class.type";
import { MessengerBaseEntity } from "./messenger-base.entity";

export interface MessengerBaseRepository<T extends MessengerBaseEntity<T>> {
  readonly clazz: ClassType<T>;
}
