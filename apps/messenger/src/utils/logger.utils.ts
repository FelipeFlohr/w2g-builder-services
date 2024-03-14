import { Logger } from "@nestjs/common";
import { ClassType } from "./types/class.type";

export class LoggerUtils {
  public static from<T>(clazz: ClassType<T>): Logger;
  public static from(name: string): Logger;
  public static from<T = void>(clazzOrName: ClassType<T> | string): Logger {
    if (typeof clazzOrName === "string") {
      return new Logger(clazzOrName);
    }
    return new Logger(clazzOrName.name);
  }
}
