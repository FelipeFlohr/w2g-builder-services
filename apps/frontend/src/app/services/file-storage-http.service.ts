import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class FileStorageHttpService {
  public constructor() {}

  public async getFileAsArrayBuffer(fileHash: string): Promise<ArrayBuffer> {
    const data = await fetch(`${environment.fileStorageUrl}/file/${fileHash}`);
    return await data.arrayBuffer();
  }
}
