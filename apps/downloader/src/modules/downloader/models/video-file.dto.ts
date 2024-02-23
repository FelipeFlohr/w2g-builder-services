import { ReadStream } from "fs";
import { VideoFileDTOOptions } from "../types/video-file-dto.options";

export class VideoFileDTO {
  public readonly url: string;
  public readonly filename: string;
  public readonly stream: ReadStream;
  public readonly mimeType: string;
  public readonly filePath?: string;

  public constructor(options: VideoFileDTOOptions) {
    this.url = options.url;
    this.filename = options.filename;
    this.stream = options.stream;
    this.mimeType = options.mimeType;
    this.filePath = options.filePath;
  }
}
