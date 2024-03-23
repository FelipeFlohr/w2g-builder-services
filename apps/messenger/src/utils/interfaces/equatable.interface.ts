export interface Equatable<T> {
  equals(val: unknown): val is T;
}
