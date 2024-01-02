export class TypeUtils {
  public static parseNullToUndefined<T>(val: T | null): T | undefined {
    if (val !== null) {
      return val as T;
    }
  }
}
