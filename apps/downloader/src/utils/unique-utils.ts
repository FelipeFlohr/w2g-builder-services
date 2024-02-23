import * as crypto from "crypto";

export class UniqueUtils {
  public static getUuidV4(): string {
    return crypto.randomUUID();
  }

  private constructor() {}
}
