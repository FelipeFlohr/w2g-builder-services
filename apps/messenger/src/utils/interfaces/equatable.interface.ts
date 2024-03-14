export interface Equatable<T> {
  equals(val: T): val is T;
}
