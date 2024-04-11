export class VisualizerRoutes {
  public static getVideoReferencesRoute(guildId: string, channelId: string): string {
    return `/builder/references/${guildId}/${channelId}`;
  }

  public static getVideoMetadataRoute(url: string): string {
    return `/video/metadata?url=${url}`;
  }
}
