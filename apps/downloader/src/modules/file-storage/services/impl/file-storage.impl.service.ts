import { Inject, Injectable } from "@nestjs/common";
import { FileStorageService } from "../file-storage.service";
import { VideoFileDTO } from "src/modules/downloader/models/video-file.dto";
import { FileStorageSavedFileDTO } from "../../models/file-storage-saved-file.dto";
import axios, { AxiosRequestConfig } from "axios";
import { EnvironmentService } from "src/env/services/environment.service";
import { FileStorageAddressesEnum } from "src/enums/file-storage-addresses.enum";
import * as FormData from "form-data";

@Injectable()
export class FileStorageServiceImpl implements FileStorageService {
  public constructor(@Inject(EnvironmentService) private readonly env: EnvironmentService) {}

  public async saveVideo(video: VideoFileDTO): Promise<FileStorageSavedFileDTO> {
    const url = `${this.env.fileStorageAddress}${FileStorageAddressesEnum.FILE}`;
    const form = this.createFormDataToSaveVideo(video);
    const config: AxiosRequestConfig<FormData> = {
      headers: form.getHeaders(),
    };

    const response = await axios.postForm(url, form, config);
    return new FileStorageSavedFileDTO(response.data);
  }

  private createFormDataToSaveVideo(video: VideoFileDTO): FormData {
    const form = new FormData();
    form.append("file", video.stream);
    return form;
  }
}
