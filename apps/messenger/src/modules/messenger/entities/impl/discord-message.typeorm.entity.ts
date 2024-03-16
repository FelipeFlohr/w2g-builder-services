import { MessengerBaseTypeORMEntity } from "src/modules/database/base/impl/messenger-base-typeorm.entity";
import { Entity, Index, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { DiscordDelimitationMessageEntity } from "../discord-delimitation-message.entity";
import { DiscordMessageAuthorEntity } from "../discord-message-author.entity";
import { DiscordMessageEntity } from "../discord-message.entity";
import { DiscordDelimitationMessageTypeORMEntity } from "./discord-delimitation-message.typeorm.entity.impl";
import { DiscordMessageAuthorTypeORMEntity } from "./discord-message-author.typeorm.entity";

@Entity({
  name: "TB_DISCORD_MESSAGE",
})
@Index(["messageId"], { unique: true })
export class DiscordMessageTypeORMEntity
  extends MessengerBaseTypeORMEntity<DiscordMessageEntity>
  implements DiscordMessageEntity
{
  @PrimaryGeneratedColumn({
    name: "DME_ID",
  })
  public id: number;

  @Column({
    name: "DME_APPID",
    type: "varchar",
    length: 2048,
    nullable: true,
  })
  public applicationId?: string;

  @OneToOne(() => DiscordMessageAuthorTypeORMEntity, (author) => author.message, {
    nullable: false,
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "DME_DMAID",
  })
  public author: DiscordMessageAuthorEntity;

  @Column({
    name: "DME_DMAID",
    type: "integer",
    nullable: false,
  })
  public authorId: number;

  @Column({
    name: "DME_CLECON",
    type: "varchar",
    length: 8192,
    nullable: false,
  })
  public cleanContent: string;

  @Column({
    name: "DME_CONTENT",
    type: "varchar",
    length: 8192,
    nullable: false,
  })
  public content: string;

  @Column({
    name: "DME_HASTHREAD",
    type: "boolean",
    nullable: false,
  })
  public hasThread: boolean;

  @Column({
    name: "DME_MESSID",
    type: "varchar",
    length: 2048,
    nullable: false,
  })
  public messageId: string;

  @Column({
    name: "DME_ISPINNABLE",
    type: "boolean",
    nullable: false,
  })
  public pinnable: boolean;

  @Column({
    name: "DME_ISPINNED",
    type: "boolean",
    nullable: false,
  })
  public pinned: boolean;

  @Column({
    name: "DME_POS",
    type: "integer",
    nullable: true,
  })
  public position?: number;

  @Column({
    name: "DME_SYSTEM",
    type: "boolean",
    nullable: false,
  })
  public system: boolean;

  @Column({
    name: "DME_URL",
    type: "varchar",
    length: 2048,
    nullable: false,
  })
  public url: string;

  @Column({
    name: "DME_GUIID",
    type: "varchar",
    length: 2048,
    nullable: false,
  })
  public guildId: string;

  @Column({
    name: "DME_CHAID",
    type: "varchar",
    length: 2048,
    nullable: false,
  })
  public channelId: string;

  @Column({
    name: "DME_MCRAT",
    type: "timestamp",
    nullable: false,
  })
  public messageCreatedAt: Date;

  @OneToOne(() => DiscordDelimitationMessageTypeORMEntity, (delimitation) => delimitation.message)
  public delimitation?: DiscordDelimitationMessageEntity;

  public equals(val: DiscordMessageEntity): val is DiscordMessageTypeORMEntity {
    if (val instanceof DiscordMessageTypeORMEntity) {
      return this.id === val.id;
    }
    return false;
  }
}
