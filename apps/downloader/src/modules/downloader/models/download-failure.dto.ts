import { Exclude } from "class-transformer";

export class DownloadFailureDTO {
  public readonly url: string;
  public readonly error: string;
  @Exclude() public readonly errorThrown?: Error;

  public constructor(url: string, error: string, errorThrown?: Error) {
    this.url = url;
    this.error = error;
    this.errorThrown = errorThrown;
  }
}
