import { Logger } from "@nestjs/common";
import { AbstractLogger, LogLevel, LogMessage } from "typeorm";

export class TypeORMLogger extends AbstractLogger {
  private readonly logger = new Logger(TypeORMLogger.name);

  protected writeLog(
    level: LogLevel,
    message: string | number | LogMessage | (string | number | LogMessage)[],
  ): void {
    switch (level) {
      case "query":
        this.handleQuery(message);
        break;
      case "error":
        this.handleError(message);
        break;
      case "warn":
        this.handleWarn(message);
        break;
      case "info":
        this.handleInfo(message);
        break;
      case "log":
        this.handleLog(message);
        break;
      case "migration":
        this.handleMigration(message);
        break;
      case "schema":
        this.handleSchema(message);
        break;
    }
  }

  private handleQuery(
    message: string | number | LogMessage | (string | number | LogMessage)[],
  ) {
    const msg = `Query | ${this.getMessage(message)}`;
    this.logger.debug(msg);
  }

  private handleSchema(
    message: string | number | LogMessage | (string | number | LogMessage)[],
  ) {
    const msg = `Schema | ${this.getMessage(message)}`;
    this.logger.debug(msg);
  }

  private handleError(
    message: string | number | LogMessage | (string | number | LogMessage)[],
  ) {
    const msg = `Error | ${this.getMessage(message)}`;
    this.logger.error(msg);
  }

  private handleWarn(
    message: string | number | LogMessage | (string | number | LogMessage)[],
  ) {
    const msg = `Warn | ${this.getMessage(message)}`;
    this.logger.warn(msg);
  }

  private handleInfo(
    message: string | number | LogMessage | (string | number | LogMessage)[],
  ) {
    const msg = `Info | ${this.getMessage(message)}`;
    this.logger.debug(msg);
  }

  private handleLog(
    message: string | number | LogMessage | (string | number | LogMessage)[],
  ) {
    const msg = `Log | ${this.getMessage(message)}`;
    this.logger.log(msg);
  }

  private handleMigration(
    message: string | number | LogMessage | (string | number | LogMessage)[],
  ) {
    const msg = `Migration | ${this.getMessage(message)}`;
    this.logger.warn(msg);
  }

  private getMessage(
    message: string | number | LogMessage | (string | number | LogMessage)[],
  ): string {
    if (Array.isArray(message)) {
      return message.map((msg) => this.getMessage(msg)).join();
    }

    if (typeof message === "string" || typeof message === "number") {
      return message.toString();
    }
    return this.logMessageObjToString(message);
  }

  private logMessageObjToString(message: LogMessage) {
    return message.message.toString();
  }
}
