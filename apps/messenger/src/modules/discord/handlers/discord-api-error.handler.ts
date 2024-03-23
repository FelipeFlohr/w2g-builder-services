import { Logger, UnprocessableEntityException } from "@nestjs/common";
import { DiscordAPIError } from "discord.js";
import { DiscordErrorCodeEnum } from "../enums/discord-error-code.enum";

export class DiscordAPIErrorHandler {
  public static handleDiscordJsErrors(e: any, logger: Logger): void {
    this.handleNumberTypeCoerce(e, logger);
  }

  private static handleNumberTypeCoerce(e: any, logger: Logger): void {
    if (e instanceof DiscordAPIError && e.code === DiscordErrorCodeEnum.NUMBER_TYPE_COERCE) {
      logger.error(e);
      throw new UnprocessableEntityException(e.message);
    }
  }

  private constructor() {}
}
