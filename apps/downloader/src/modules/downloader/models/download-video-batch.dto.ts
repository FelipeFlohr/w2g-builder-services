import { DownloadFailureDTO } from "./download-failure.dto";
import { PersistedVideoOnFileStorageDTO } from "./persisted-video-on-file-storage.dto";

export class DownloadVideoBatchDTO {
  public readonly downloaded: Array<PersistedVideoOnFileStorageDTO> = [];
  public readonly failed: Array<DownloadFailureDTO> = [];

  public constructor(downloaded: Array<PersistedVideoOnFileStorageDTO>, failed: Array<DownloadFailureDTO>) {
    this.downloaded = downloaded;
    this.failed = failed;
  }
}
