import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DiscordListenerRepository } from "../discord-listener.repository";
import { MessengerBaseTypeORMRepository } from "src/database/base/impl/messenger-base-typeorm.repository";
import { DiscordListenerTypeORMEntity } from "../../entities/impl/discord-listener.typeorm.entity";
import { DatabaseService } from "src/database/database.service";
import { DiscordListenerEntity } from "../../entities/discord-listener.entity";
import { TypeUtils } from "src/utils/type-utils";
import { DiscordTextChannelListenerDTO } from "../../models/discord-text-channel-listener.dto";
import { FindOptionsWhere } from "typeorm";

@Injectable()
export class DiscordListenerRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordListenerTypeORMEntity>
  implements DiscordListenerRepository
{
  public constructor(
    @Inject(DatabaseService) databaseService: DatabaseService,
  ) {
    super(databaseService, DiscordListenerTypeORMEntity);
  }

  public async saveListener(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<void> {
    await this.getRepository().save({
      guildId: listener.guildId,
      channelId: listener.channelId,
    });
  }

  public async deleteListener(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<void> {
    const criteria: FindOptionsWhere<DiscordListenerTypeORMEntity> = {
      channelId: listener.channelId,
      guildId: listener.guildId,
    };
    const res = await this.getRepository().delete(criteria);

    if (res.affected === 0) {
      throw new NotFoundException();
    }
  }

  public async findListenerByDTO(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<DiscordListenerEntity | undefined> {
    const res = await this.getRepository().findOne({
      where: { guildId: listener.guildId, channelId: listener.channelId },
      select: { id: true, channelId: true, guildId: true },
    });
    return TypeUtils.parseNullToUndefined(res);
  }
}
