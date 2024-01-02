import { OAuth2Guild } from "discord.js";
import { DiscordGuild } from "../discord-guild";
import { DiscordGuildInfo } from "../discord-guild-info";
import { DiscordJsGuildInfoOptionsType } from "../types/discord-js-guild-info-options.type";
import { TypeUtils } from "src/utils/type-utils";
import { DiscordJsGuildImpl } from "./discord-js-guild.impl";
import { DiscordGuildInfoDTO } from "src/modules/discord/models/discord-guild-info.dto";

export class DiscordJsGuildInfoImpl implements DiscordGuildInfo {
  public readonly id: string;
  public readonly verified: boolean;
  public readonly createdAt: Date;
  public readonly iconPngUrl?: string;
  public readonly iconJpegUrl?: string;
  public readonly iconGifUrl?: string;
  private readonly authGuild: OAuth2Guild;

  public constructor(options: DiscordJsGuildInfoOptionsType) {
    this.id = options.id;
    this.verified = options.verified;
    this.createdAt = options.createdAt;
    this.iconPngUrl = options.iconPngUrl;
    this.iconJpegUrl = options.iconJpegUrl;
    this.iconGifUrl = options.iconGifUrl;
    this.authGuild = options.authGuild;
  }

  public static fromOAuth2Guild(
    discordJsGuild: OAuth2Guild,
  ): DiscordJsGuildInfoImpl {
    return new DiscordJsGuildInfoImpl({
      authGuild: discordJsGuild,
      createdAt: discordJsGuild.createdAt,
      id: discordJsGuild.id,
      verified: discordJsGuild.verified,
      iconGifUrl: TypeUtils.parseNullToUndefined(
        discordJsGuild.iconURL({
          extension: "gif",
          forceStatic: false,
          size: 512,
        }),
      ),
      iconJpegUrl: TypeUtils.parseNullToUndefined(
        discordJsGuild.iconURL({
          extension: "jpeg",
          forceStatic: true,
          size: 512,
        }),
      ),
      iconPngUrl: TypeUtils.parseNullToUndefined(
        discordJsGuild.iconURL({
          extension: "png",
          forceStatic: true,
          size: 512,
        }),
      ),
    });
  }

  public async fetch(): Promise<DiscordGuild> {
    const guild = await this.authGuild.fetch();
    return DiscordJsGuildImpl.fromGuild(guild);
  }

  public toDTO(): DiscordGuildInfoDTO {
    return new DiscordGuildInfoDTO({
      createdAt: this.createdAt,
      id: this.id,
      verified: this.verified,
      iconGifUrl: this.iconGifUrl,
      iconJpegUrl: this.iconJpegUrl,
      iconPngUrl: this.iconPngUrl,
    });
  }
}
