import { GuildInfoDTO } from "../../../models/guild-info.dto";

export interface GuildSelectorService {
  getGuilds(): Promise<Array<GuildInfoDTO>>;
}
