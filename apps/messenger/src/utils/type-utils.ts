export class TypeUtils {
  public static parseNullToUndefined<T>(val: T | null): T | undefined {
    if (val !== null) {
      return val as T;
    }
  }

  private constructor() {}
}

export type ClassType<T> = {
  new (...args: any): T;
};

export interface Equatable<T> {
  equals(val: T): boolean;
}
