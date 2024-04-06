import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  public constructor() {}

  public async get<T>(url: string): Promise<T> {
    url = url.startsWith("/") ? url : `/${url}`;
    const fetchInit = await fetch(`${environment.builderUrl}${url}`);
    return (await fetchInit.json()) as T;
  }
}
