import { ReadStream, createReadStream } from "fs";
import * as fsPromises from "fs/promises";
import { LoggerUtils } from "./logger-utils";

export class StreamUtils {
  private static readonly logger = LoggerUtils.from(StreamUtils);

  public static createDeletableReadStream(filePath: string): ReadStream {
    const stream = createReadStream(filePath);
    stream.on("close", async () => {
      try {
        await fsPromises.unlink(filePath);
      } catch (e) {
        this.logger.error(`Failed to delete ${filePath}`, e);
      }
    });

    return stream;
  }
}
