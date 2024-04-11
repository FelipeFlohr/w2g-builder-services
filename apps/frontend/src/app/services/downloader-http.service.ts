import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpServiceWrapper } from "./wrappers/http-service.wrapper";

@Injectable({
  providedIn: "root",
})
export class DownloaderHttpService {
  public constructor() {}

  public async get<T>(url: string): Promise<T> {
    url = url.startsWith("/") ? url : `/${url}`;
    return await HttpServiceWrapper.get(`${environment.downloaderUrl}${url}`);
  }
}
