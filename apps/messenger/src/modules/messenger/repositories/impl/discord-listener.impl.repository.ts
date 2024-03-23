import { Inject, Injectable } from "@nestjs/common";
import { CacheServiceProvider } from "src/modules/cache/providers/cache-service.provider";
import { CacheService } from "src/modules/cache/services/cache.service";
import { MessengerBaseTypeORMRepository } from "src/modules/database/base/impl/messenger-base-typeorm.repository";
import { DatabaseServiceProvider } from "src/modules/database/providers/database-service.provider";
import { DatabaseService } from "src/modules/database/services/database.service";
import { CollectionUtils } from "src/utils/collection.utils";
import { TypeUtils } from "src/utils/type.utils";
import { DiscordListenerEntity } from "../../entities/discord-listener.entity";
import { DiscordListenerTypeORMEntity } from "../../entities/impl/discord-listener.typeorm.entity";
import { DiscordListenerCacheKeysGenerator } from "../../keys/discord-listener-cache-keys.generator";
import { DiscordDelimitationMessageRepositoryProvider } from "../../providers/discord-delimitation-message-repository.provider";
import { DiscordDelimitationMessageRepository } from "../discord-delimitation-message.repository";
import { DiscordListenerRepository } from "../discord-listener.repository";

@Injectable()
export class DiscordListenerRepositoryImpl
  extends MessengerBaseTypeORMRepository<DiscordListenerTypeORMEntity>
  implements DiscordListenerRepository
{
  private readonly cacheService: CacheService;
  private readonly delimitationRepository: DiscordDelimitationMessageRepository;

  public constructor(
    @Inject(DatabaseServiceProvider) databaseService: DatabaseService,
    @Inject(CacheServiceProvider) cacheService: CacheService,
    @Inject(DiscordDelimitationMessageRepositoryProvider) delimitationRepository: DiscordDelimitationMessageRepository,
  ) {
    super(databaseService, DiscordListenerTypeORMEntity);
    this.cacheService = cacheService;
    this.delimitationRepository = delimitationRepository;
  }

  public async getById(id: number): Promise<DiscordListenerTypeORMEntity | undefined> {
    const cacheEntity = await this.cacheService.get<DiscordListenerTypeORMEntity>(
      DiscordListenerCacheKeysGenerator.getKeyFinderById(id),
    );
    if (cacheEntity) return cacheEntity;

    const res = await this.getRepository().findOneBy({ id });
    return TypeUtils.parseNullToUndefined(res);
  }

  public async deleteById(id: number, channelId?: string, guildId?: string): Promise<number | undefined> {
    await this.cacheService.delete(DiscordListenerCacheKeysGenerator.getKeyFinderById(id));

    if (channelId == undefined || guildId == undefined) {
      const delimitation = await this.getRepository().findOne({
        select: { channelId: true, guildId: true },
        where: { channelId, guildId },
        loadEagerRelations: false,
      });
      channelId = delimitation?.channelId;
      guildId = delimitation?.guildId;
    }

    if (await this.existsById(id)) {
      await this.getRepository().delete(id);
      await this.delimitationRepository.deleteByGuildIdAndChannelId(channelId as string, guildId as string);
      return id;
    }
  }

  public async existsById(id: number): Promise<boolean> {
    const cacheExists = await this.cacheService.getAsString(DiscordListenerCacheKeysGenerator.getKeyFinderById(id));
    if (cacheExists) return true;
    return await this.getRepository().existsBy({ id });
  }

  public async existsByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean> {
    const cacheExists = await this.cacheService.getAsString(
      DiscordListenerCacheKeysGenerator.getKeyFinderByChannelIdAndGuildId(channelId, guildId),
    );
    if (cacheExists) return true;

    return await this.getRepository().existsBy({ channelId, guildId });
  }

  public async getByChannelIdAndGuildId(
    channelId: string,
    guildId: string,
  ): Promise<DiscordListenerEntity | undefined> {
    const cacheListener = await this.cacheService.get<DiscordListenerEntity>(
      DiscordListenerCacheKeysGenerator.getKeyFinderByChannelIdAndGuildId(channelId, guildId),
    );
    if (cacheListener) return cacheListener;

    const res = await this.getRepository().findOneBy({ channelId, guildId });
    return TypeUtils.parseNullToUndefined(res);
  }

  public async saveListenerAndFlush(channelId: string, guildId: string): Promise<DiscordListenerEntity> {
    const listener = await this.getByChannelIdAndGuildId(channelId, guildId);
    if (listener) return listener;

    const entity = new DiscordListenerTypeORMEntity();
    entity.channelId = channelId;
    entity.guildId = guildId;
    const persistedEntity = await this.getRepository().save(entity, { reload: true });

    await this.saveListenerToCache(persistedEntity);
    return persistedEntity;
  }

  public async getAllListeners(): Promise<DiscordListenerEntity[]> {
    const allCachedListeners = await this.getAllCachedListeners();
    const listenersIds = allCachedListeners.map((l) => l.id);

    let queryBuilder = this.getRepository().createQueryBuilder("dli").select();
    if (listenersIds.length > 0) {
      queryBuilder = queryBuilder.where("dli.id not in (:...ids)", { ids: listenersIds });
    }

    const listeners = await queryBuilder.getMany();
    await CollectionUtils.asyncForEach(listeners, async (listener) => await this.saveListenerToCache(listener));
    return [...allCachedListeners, ...listeners];
  }

  public async deleteListenerByChannelIdAndGuildId(channelId: string, guildId: string): Promise<boolean> {
    const listener = await this.getRepository().findOne({
      select: { id: true },
      where: { channelId, guildId },
      loadEagerRelations: false,
    });
    if (listener?.id) {
      await this.deleteById(listener.id, channelId, guildId);
      return true;
    }
    return false;
  }

  private async getAllCachedListeners(): Promise<Array<DiscordListenerEntity>> {
    const keys = await this.cacheService.getKeys(DiscordListenerCacheKeysGenerator.getKeyFinderAllKeys());
    const res = await CollectionUtils.asyncMap(
      keys,
      async (key) => await this.cacheService.get<DiscordListenerTypeORMEntity>(key),
    );
    return res.filter((e) => e != undefined) as Array<DiscordListenerEntity>;
  }

  private async saveListenerToCache(listener: DiscordListenerEntity): Promise<void> {
    const key = DiscordListenerCacheKeysGenerator.generateListenerKey(
      listener.id,
      listener.channelId,
      listener.guildId,
    );
    await this.cacheService.save(key, listener);
  }
}
