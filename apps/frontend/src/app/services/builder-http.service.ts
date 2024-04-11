import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { HttpServiceWrapper } from "./wrappers/http-service.wrapper";

@Injectable({
  providedIn: "root",
})
export class BuilderHttpService {
  public constructor() {}

  public async get<T>(url: string): Promise<T> {
    url = url.startsWith("/") ? url : `/${url}`;
    return await HttpServiceWrapper.get(`${environment.builderUrl}${url}`);
  }
}
