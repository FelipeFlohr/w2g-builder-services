import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DiscordListenerRepository } from "../discord-listener.repository";
import { MessengerBaseTypeORMRepository } from "src/database/base/impl/messenger-base-typeorm.repository";
import { DiscordListenerTypeORMEntity } from "../../entities/impl/discord-listener.typeorm.entity";
import { DatabaseService } from "src/database/database.service";
import { DiscordListenerEntity } from "../../entities/discord-listener.entity";
import { TypeUtils } from "src/utils/type-utils";
import { DiscordTextChannelListenerDTO } from "../../models/discord-text-channel-listener.dto";
import { FindOptionsWhere } from "typeorm";
import { DiscordListenerCacheRepository } from "../discord-listener-cache.repository";
import { CollectionUtils } from "src/utils/collection-utils";

@Injectable()
export class DiscordListenerRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordListenerTypeORMEntity>
  implements DiscordListenerRepository
{
  private readonly cacheRepository: DiscordListenerCacheRepository;

  public constructor(
    @Inject(DatabaseService) databaseService: DatabaseService,
    @Inject(DiscordListenerCacheRepository)
    cacheRepository: DiscordListenerRepository,
  ) {
    super(databaseService, DiscordListenerTypeORMEntity);
    this.cacheRepository = cacheRepository;
  }

  public async saveListener(listener: DiscordTextChannelListenerDTO): Promise<void> {
    await Promise.all([
      this.getRepository().save({
        guildId: listener.guildId,
        channelId: listener.channelId,
      }),
      this.cacheRepository.saveListener(listener),
    ]);
  }

  public async deleteListener(listener: DiscordTextChannelListenerDTO): Promise<void> {
    const criteria: FindOptionsWhere<DiscordListenerTypeORMEntity> = {
      channelId: listener.channelId,
      guildId: listener.guildId,
    };
    const res = await this.getRepository().delete(criteria);
    await this.cacheRepository.deleteListener(listener);

    if (res.affected === 0) {
      throw new NotFoundException();
    }
  }

  public async findListenerByDTO(listener: DiscordTextChannelListenerDTO): Promise<DiscordListenerEntity | undefined> {
    const cacheVal = await this.cacheRepository.findListenerByDTO(listener);
    if (cacheVal) return await this.findEntityByChannelAndGuildId(cacheVal.channelId, cacheVal.guildId);

    const res = await this.getRepository().findOne({
      where: { guildId: listener.guildId, channelId: listener.channelId },
      select: { id: true, channelId: true, guildId: true },
    });
    return TypeUtils.parseNullToUndefined(res);
  }

  public async findAllListeners(): Promise<DiscordListenerEntity[]> {
    const cachedListeners = await this.cacheRepository.findAllListeners();
    const cachedListenersChannelIds = cachedListeners.map((listener) => listener.channelId);
    const cachedListenerGuildIds = cachedListeners.map((listener) => listener.guildId);

    let queryBuilder = this.getRepository().createQueryBuilder("dli");
    if (CollectionUtils.isNotEmpty(cachedListenersChannelIds) && CollectionUtils.isNotEmpty(cachedListenerGuildIds)) {
      queryBuilder = queryBuilder.where("dli.channelId NOT IN (:...channelsId) AND dli.guildId NOT IN (:...guildsId)", {
        channelsId: cachedListenersChannelIds,
        guildsId: cachedListenerGuildIds,
      });
    }
    const res = await queryBuilder.getMany();

    const cachedListenersEntity = await CollectionUtils.asyncMap(
      cachedListeners,
      async (listener) => await this.findEntityByChannelAndGuildId(listener.channelId, listener.guildId),
    );
    const cachedListenersEntityNotNull = cachedListenersEntity.filter(
      (entity) => entity != undefined,
    ) as Array<DiscordListenerEntity>;
    return CollectionUtils.removeDuplicated([...cachedListenersEntityNotNull, ...res]);
  }

  private async findEntityByChannelAndGuildId(
    channelId: string,
    guildId: string,
  ): Promise<DiscordListenerEntity | undefined> {
    const res = await this.getRepository().findOne({
      select: {
        channelId: false,
        createdAt: true,
        guildId: false,
        id: true,
        updatedAt: true,
        version: true,
      },
      where: {
        channelId: channelId,
        guildId: guildId,
      },
    });

    if (res) {
      res.channelId = channelId;
      res.guildId = guildId;
      return res;
    }
  }
}
