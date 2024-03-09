import { ReadStream, createReadStream } from "fs";
import { LoggerUtils } from "./logger-utils";
import * as fsPromises from "fs/promises";

export class StreamUtils {
  private static readonly logger = LoggerUtils.from(StreamUtils);

  public static createDeletableReadStream(filePath: string): ReadStream {
    const stream = createReadStream(filePath);
    stream.on("end", async () => {
      try {
        await fsPromises.unlink(filePath);
      } catch (e) {
        this.logger.error(`Failed to delete ${filePath}`, e);
      }
    });

    return stream;
  }
}
