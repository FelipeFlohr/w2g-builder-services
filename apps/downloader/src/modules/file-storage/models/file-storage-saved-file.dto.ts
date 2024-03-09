import { FileStorageSavedFileDTOOptions } from "../types/file-storage-saved-file-dto.options";

export class FileStorageSavedFileDTO {
  public readonly fileHash: string;
  public readonly fileName: string;
  public readonly mimeType: string;

  public constructor(options: FileStorageSavedFileDTOOptions) {
    this.fileHash = options.fileHash;
    this.fileName = options.fileName;
    this.mimeType = options.mimeType;
  }
}
