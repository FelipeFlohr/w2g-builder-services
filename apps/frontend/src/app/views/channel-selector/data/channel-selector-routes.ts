export class ChannelSelectorRoutes {
  public static getChannelsRoute(guildId: string) {
    return `/builder/channels/${guildId}`;
  }
}
