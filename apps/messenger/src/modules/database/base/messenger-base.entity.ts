import { Equatable } from "src/utils/interfaces/equatable.interface";

export interface MessengerBaseEntity<T> extends Equatable<T> {
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
