import { MessengerBaseTypeORMEntity } from "src/database/base/impl/messenger-base-typeorm.entity";
import { DiscordDelimitationMessageEntity } from "../discord-delimitation-message.entity";
import { DiscordMessageEntity } from "../discord-message.entity";
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DiscordMessageTypeORMEntity } from "./discord-message.typeorm.entity";

@Entity({
  name: "TB_DISCORD_DELIMITATION_MESSAGE",
})
export class DiscordDelimitationMessageTypeORMEntity
  extends MessengerBaseTypeORMEntity
  implements DiscordDelimitationMessageEntity
{
  @PrimaryGeneratedColumn({
    name: "DDM_ID",
  })
  public id: number;

  @OneToOne(
    () => DiscordMessageTypeORMEntity,
    (message) => message.delimitation,
    { nullable: false },
  )
  @JoinColumn({
    name: "DDM_DMEID",
  })
  public message: DiscordMessageEntity;
}
