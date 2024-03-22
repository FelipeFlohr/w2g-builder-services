import { MessengerBaseTypeORMEntity } from "src/modules/database/base/impl/messenger-base-typeorm.entity";
import { Entity, Index, PrimaryGeneratedColumn, OneToOne, JoinColumn, Column } from "typeorm";
import { DiscordDelimitationMessageEntity } from "../discord-delimitation-message.entity";
import { DiscordMessageEntity } from "../discord-message.entity";
import { DiscordMessageTypeORMEntity } from "./discord-message.typeorm.entity";
import { DiscordDelimitationMessageDTO } from "src/models/discord-demilitation-message.dto";

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
    eager: true,
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

  public equals(val: unknown): val is DiscordDelimitationMessageEntity {
    if (val instanceof DiscordDelimitationMessageTypeORMEntity) {
      return this.id === val.id;
    }
    return false;
  }

  public static fromDTO(delimitation: DiscordDelimitationMessageDTO): DiscordDelimitationMessageTypeORMEntity {
    const entity = new DiscordDelimitationMessageTypeORMEntity();
    entity.createdAt = delimitation.createdAt;
    entity.message = DiscordMessageTypeORMEntity.fromDTO(delimitation.message);
    return entity;
  }
}
