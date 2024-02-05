import { CacheService } from "src/cache/cache.service";
import { DiscordListenerEntity } from "../../entities/discord-listener.entity";
import { DiscordTextChannelListenerDTO } from "../../models/discord-text-channel-listener.dto";
import { Inject } from "@nestjs/common";
import { DiscordListenerCacheKeys } from "../keys/discord-listener.cache-keys";
import { DiscordListenerCacheRepository } from "../discord-listener-cache.repository";
import { CollectionUtils } from "src/utils/collection-utils";

export class DiscordListenerCacheRepositoryImpl implements DiscordListenerCacheRepository {
  private readonly cacheService: CacheService;

  public constructor(@Inject(CacheService) cacheService: CacheService) {
    this.cacheService = cacheService;
  }

  public async saveListener(listener: DiscordTextChannelListenerDTO): Promise<void> {
    const key = DiscordListenerCacheKeys.getListenerKey(listener);
    await this.cacheService.save(key, listener);
  }
  public async deleteListener(listener: DiscordTextChannelListenerDTO): Promise<void> {
    const key = DiscordListenerCacheKeys.getListenerKey(listener);
    await this.cacheService.delete(key);
  }
  public async findListenerByDTO(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<DiscordTextChannelListenerDTO | undefined> {
    const key = DiscordListenerCacheKeys.getListenerKey(listener);
    return await this.cacheService.get(key);
  }

  public async findAllListeners(): Promise<Array<DiscordTextChannelListenerDTO>> {
    const keys = await this.cacheService.getKeys(DiscordListenerCacheKeys.ALL_LISTENERS_KEY);

    const cachedListeners = await CollectionUtils.asyncMap(keys, async (key) => {
      return await this.cacheService.get<DiscordListenerEntity>(key);
    });
    return cachedListeners.filter((val) => val != undefined) as Array<DiscordListenerEntity>;
  }
}
