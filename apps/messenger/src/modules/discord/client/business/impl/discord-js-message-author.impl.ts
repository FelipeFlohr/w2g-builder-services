import { User } from "discord.js";
import { DiscordMessageAuthor } from "../discord-message-author";
import { DiscordJsMessageAuthorOptions } from "../types/discord-js-message-author-options.type";
import { TypeUtils } from "src/utils/type-utils";
import { DiscordMessageAuthorDTO } from "src/modules/discord/models/discord-message-author.dto";

export class DiscordJsMessageAuthorImpl implements DiscordMessageAuthor {
  public readonly avatarPngUrl?: string;
  public readonly bannerPngUrl?: string;
  public readonly bot: boolean;
  public readonly createdAt: Date;
  public readonly discriminator: string;
  public readonly displayName: string;
  public readonly globalName?: string;
  public readonly id: string;
  public readonly tag: string;
  public readonly system: boolean;
  public readonly username: string;
  private readonly user: User;

  public constructor(options: DiscordJsMessageAuthorOptions) {
    this.avatarPngUrl = options.avatarPngUrl;
    this.bannerPngUrl = options.bannerPngUrl;
    this.bot = options.bot;
    this.createdAt = options.createdAt;
    this.discriminator = options.discriminator;
    this.displayName = options.displayName;
    this.globalName = options.globalName;
    this.id = options.id;
    this.tag = options.tag;
    this.system = options.system;
    this.username = options.username;
    this.user = options.user;
  }

  public static fromJsAuthor(user: User): DiscordJsMessageAuthorImpl {
    return new DiscordJsMessageAuthorImpl({
      bot: user.bot,
      createdAt: user.createdAt,
      discriminator: user.discriminator,
      displayName: user.displayName,
      id: user.id,
      system: user.system,
      tag: user.tag,
      user: user,
      username: user.username,
      avatarPngUrl: TypeUtils.parseNullToUndefined(
        user.avatarURL({
          extension: "png",
          forceStatic: true,
          size: 512,
        }),
      ),
      bannerPngUrl: TypeUtils.parseNullToUndefined(
        user.bannerURL({
          extension: "png",
          forceStatic: true,
          size: 512,
        }),
      ),
      globalName: TypeUtils.parseNullToUndefined(user.globalName),
    });
  }

  public toDTO(): DiscordMessageAuthorDTO {
    return new DiscordMessageAuthorDTO({
      bot: this.bot,
      createdAt: this.createdAt,
      discriminator: this.discriminator,
      displayName: this.displayName,
      id: this.id,
      system: this.system,
      tag: this.tag,
      username: this.username,
      avatarPngUrl: this.avatarPngUrl,
      bannerPngUrl: this.bannerPngUrl,
      globalName: this.globalName,
    });
  }
}
