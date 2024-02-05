import { MessengerBaseTypeORMEntity } from "src/database/base/impl/messenger-base-typeorm.entity";
import { DiscordDelimitationMessageEntity } from "../discord-delimitation-message.entity";
import { DiscordMessageEntity } from "../discord-message.entity";
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DiscordMessageTypeORMEntity } from "./discord-message.typeorm.entity";

@Entity({
  name: "TB_DISCORD_DELIMITATION_MESSAGE",
})
@Index(["message"], {
  unique: true,
})
export class DiscordDelimitationMessageTypeORMEntity
  extends MessengerBaseTypeORMEntity<DiscordDelimitationMessageEntity>
  implements DiscordDelimitationMessageEntity
{
  @PrimaryGeneratedColumn({
    name: "DDM_ID",
  })
  public id: number;

  @OneToOne(() => DiscordMessageTypeORMEntity, (message) => message.delimitation, {
    nullable: false,
    cascade: true,
    lazy: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "DDM_DMEID",
  })
  public message: DiscordMessageEntity;

  @Column({
    name: "DDM_DMEID",
    type: "integer",
    nullable: false,
  })
  public messageId: number;

  public equals(val: DiscordDelimitationMessageEntity): boolean {
    return this.id === val.id;
  }
}
