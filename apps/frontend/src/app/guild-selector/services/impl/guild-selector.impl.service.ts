import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { GuildInfoDTO } from "../../../../models/guild-info.dto";
import { GuildSelectorRoutes } from "../../data/guild-selector-routes";
import { GuildInfoType } from "../../types/guild-info.type";
import { GuildSelectorService } from "../guild-selector.service";

@Injectable({
  providedIn: "root",
})
export class GuildSelectorServiceImpl implements GuildSelectorService {
  public constructor(@Inject(HttpClient) private readonly httpClient: HttpClient) {}

  public getGuilds(): Promise<GuildInfoDTO[]> {
    return new Promise((res, rej) => {
      this.httpClient
        .get<Array<GuildInfoType>>(`${environment.builderUrl}${GuildSelectorRoutes.GUILDS}`)
        .subscribe((data) => {
          try {
            res(data.map((d) => new GuildInfoDTO(d)));
          } catch (e) {
            rej(e);
          }
        });
    });
  }
}
