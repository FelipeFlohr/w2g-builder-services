import { ChannelInfoDTO } from "../../../models/channel-info.dto";

export interface ChannelSelectorService {
  getChannels(guildId: string): Promise<Array<ChannelInfoDTO>>;
}
