import { VideoFileDTO } from "src/modules/downloader/models/video-file.dto";
import { FileStorageSavedFileDTO } from "../models/file-storage-saved-file.dto";

export interface FileStorageService {
  saveVideo(video: VideoFileDTO): Promise<FileStorageSavedFileDTO>;
}

export const FileStorageService = Symbol("FileStorageService");
