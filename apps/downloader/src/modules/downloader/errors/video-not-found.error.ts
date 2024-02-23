import { HttpException, HttpStatus } from "@nestjs/common";

export class VideoNotFoundError extends HttpException {
  public readonly url: string;

  public constructor(url: string) {
    super(`Video ${url} not found`, HttpStatus.NOT_FOUND);
    this.url = url;
  }
}
