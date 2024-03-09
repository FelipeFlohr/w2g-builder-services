export class PersistedVideoOnFileStorageDTO {
  public readonly url: string;
  public readonly fileHash: string;
  public readonly filename: string;
  public readonly mimeType: string;

  public constructor(url: string, fileHash: string, filename: string, mimeType: string) {
    this.url = url;
    this.fileHash = fileHash;
    this.filename = filename;
    this.mimeType = mimeType;
  }
}
