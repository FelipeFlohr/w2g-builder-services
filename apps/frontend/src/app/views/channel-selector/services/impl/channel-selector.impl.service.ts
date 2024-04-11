import { Injectable, inject } from "@angular/core";
import { ChannelInfoDTO } from "../../../../models/channel-info.dto";
import { BuilderHttpService } from "../../../../services/builder-http.service";
import { ChannelInfoType } from "../../../../types/channel-info.type";
import { ChannelSelectorRoutes } from "../../data/channel-selector-routes";
import { ChannelSelectorService } from "../channel-selector.service";

@Injectable({
  providedIn: "root",
})
export class ChannelSelectorServiceImpl implements ChannelSelectorService {
  private readonly builderHttpService = inject(BuilderHttpService);

  public constructor() {}

  public async getChannels(guildId: string): Promise<ChannelInfoDTO[]> {
    const data = await this.builderHttpService.get<Array<ChannelInfoType>>(
      ChannelSelectorRoutes.getChannelsRoute(guildId),
    );
    return data.map((d) => new ChannelInfoDTO(d));
  }
}
