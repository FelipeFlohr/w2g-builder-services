import { Equatable } from "src/utils/type-utils";

export interface MessengerBaseEntity<T> extends Equatable<T> {
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
