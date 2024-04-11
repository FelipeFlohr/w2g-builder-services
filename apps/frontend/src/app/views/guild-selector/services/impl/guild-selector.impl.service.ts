import { Injectable, inject } from "@angular/core";
import { GuildInfoDTO } from "../../../../models/guild-info.dto";
import { BuilderHttpService } from "../../../../services/builder-http.service";
import { GuildInfoType } from "../../../../types/guild-info.type";
import { GuildSelectorRoutes } from "../../data/guild-selector-routes";
import { GuildSelectorService } from "../guild-selector.service";

@Injectable({
  providedIn: "root",
})
export class GuildSelectorServiceImpl implements GuildSelectorService {
  private readonly builderHttpService = inject(BuilderHttpService);

  public constructor() {}

  public async getGuilds(): Promise<Array<GuildInfoDTO>> {
    const data = await this.builderHttpService.get<Array<GuildInfoType>>(GuildSelectorRoutes.GUILDS);
    return data.map((d) => new GuildInfoDTO(d));
  }
}
