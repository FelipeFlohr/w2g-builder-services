import { MessengerBaseTypeORMEntity } from "src/modules/database/base/impl/messenger-base-typeorm.entity";
import { Entity, Index, PrimaryGeneratedColumn, Column } from "typeorm";
import { DiscordListenerEntity } from "../discord-listener.entity";

@Entity({
  name: "TB_DISCORD_LISTENER",
})
@Index(["guildId", "channelId"], { unique: true })
export class DiscordListenerTypeORMEntity
  extends MessengerBaseTypeORMEntity<DiscordListenerEntity>
  implements DiscordListenerEntity
{
  @PrimaryGeneratedColumn({
    name: "DLI_ID",
  })
  public id: number;

  @Column({
    name: "DLI_GUIID",
    type: "varchar",
    length: 256,
    nullable: false,
  })
  public guildId: string;

  @Column({
    name: "DLI_CHAID",
    type: "varchar",
    length: 256,
    nullable: false,
  })
  public channelId: string;

  public equals(val: unknown): val is DiscordListenerEntity {
    if (val instanceof DiscordListenerTypeORMEntity) {
      return val.id === this.id;
    }
    return false;
  }
}
