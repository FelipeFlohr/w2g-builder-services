import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { DiscordListenerEntity } from "../discord-listener.entity";
import { MessengerBaseTypeORMEntity } from "src/database/base/impl/messenger-base-typeorm.entity";

@Entity({
  name: "TB_DISCORD_LISTENER",
})
@Index(["guildId", "channelId"], { unique: true })
export class DiscordListenerTypeORMEntity
  extends MessengerBaseTypeORMEntity
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
}
