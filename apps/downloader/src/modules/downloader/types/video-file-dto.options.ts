import { ReadStream } from "fs";

export type VideoFileDTOOptions = {
  readonly url: string;
  readonly filename: string;
  readonly stream: ReadStream;
  readonly mimeType: string;
  readonly filePath?: string;
};
