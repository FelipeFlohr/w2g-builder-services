import { HttpException, HttpStatus } from "@nestjs/common";

export class FailedToDownloadError extends HttpException {
  public readonly url: string;

  public constructor(url: string, cause?: Error) {
    super(`Failed to download "${url}"`, HttpStatus.INTERNAL_SERVER_ERROR, { cause: cause ?? new Error() });
  }
}
