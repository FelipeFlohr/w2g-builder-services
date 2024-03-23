import { DiscordMessageAuthorDTO } from "src/models/discord-message-author.dto";
import { MessengerBaseTypeORMEntity } from "src/modules/database/base/impl/messenger-base-typeorm.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DiscordMessageAuthorTypeORMOptions } from "../../types/discord-message-author-typeorm-options.type";
import { DiscordMessageAuthorEntity } from "../discord-message-author.entity";
import { DiscordMessageEntity } from "../discord-message.entity";
import { DiscordMessageTypeORMEntity } from "./discord-message.typeorm.entity";

@Entity({
  name: "TB_DISCORD_MESSAGE_AUTHOR",
})
export class DiscordMessageAuthorTypeORMEntity
  extends MessengerBaseTypeORMEntity<DiscordMessageAuthorEntity>
  implements DiscordMessageAuthorEntity
{
  @PrimaryGeneratedColumn({
    name: "DMA_ID",
  })
  public id: number;

  @Column({
    name: "DMA_AVAPNGURL",
    type: "varchar",
    length: 2048,
    nullable: true,
  })
  public avatarPngUrl?: string;

  @Column({
    name: "DMA_BANPNGURL",
    type: "varchar",
    length: 2048,
    nullable: true,
  })
  public bannerPngUrl?: string;

  @Column({
    name: "DMA_ISBOT",
    type: "boolean",
    nullable: false,
  })
  public bot: boolean;

  @Column({
    name: "DMA_DISCRIM",
    type: "varchar",
    length: 2048,
    nullable: false,
  })
  public discriminator: string;

  @Column({
    name: "DMA_DISPNAM",
    type: "varchar",
    length: 128,
    nullable: false,
  })
  public displayName: string;

  @Column({
    name: "DMA_GLOBNAM",
    type: "varchar",
    length: 128,
    nullable: true,
  })
  public globalName?: string;

  @Column({
    name: "DMA_AUTID",
    type: "varchar",
    length: 4000,
    nullable: false,
  })
  public authorId: string;

  @Column({
    name: "DMA_ACRAT",
    type: "timestamp",
    nullable: false,
  })
  public authorCreatedAt: Date;

  @Column({
    name: "DMA_TAG",
    type: "varchar",
    length: 1024,
    nullable: false,
  })
  public tag: string;

  @Column({
    name: "DMA_ISSYS",
    type: "boolean",
    nullable: false,
  })
  public system: boolean;

  @Column({
    name: "DMA_USRNAM",
    type: "varchar",
    length: 256,
    nullable: false,
  })
  public username: string;

  @OneToOne(() => DiscordMessageTypeORMEntity, (message) => message.author, {
    nullable: false,
    cascade: ["insert", "update"],
    lazy: true,
    onDelete: "CASCADE",
  })
  public message: DiscordMessageEntity;

  public constructor(options?: DiscordMessageAuthorTypeORMOptions) {
    super();
    if (options) {
      this.avatarPngUrl = options.avatarPngUrl;
      this.bannerPngUrl = options.bannerPngUrl;
      this.bot = options.bot;
      this.authorCreatedAt = options.authorCreatedAt;
      this.discriminator = options.discriminator;
      this.displayName = options.displayName;
      this.globalName = options.globalName;
      this.authorId = options.authorId;
      this.tag = options.tag;
      this.system = options.system;
      this.username = options.username;
    }
  }

  public equals(val: unknown): val is DiscordMessageAuthorTypeORMEntity {
    if (val instanceof DiscordMessageAuthorTypeORMEntity) {
      return this.id === val.id;
    }
    return false;
  }

  public static fromDTO(author: DiscordMessageAuthorDTO): DiscordMessageAuthorTypeORMEntity {
    return new DiscordMessageAuthorTypeORMEntity({
      authorCreatedAt: author.createdAt,
      authorId: author.id,
      bot: author.bot,
      discriminator: author.discriminator,
      displayName: author.displayName,
      system: author.system,
      tag: author.tag,
      username: author.username,
      avatarPngUrl: author.avatarPngUrl,
      bannerPngUrl: author.bannerPngUrl,
      globalName: author.globalName,
    });
  }
}
