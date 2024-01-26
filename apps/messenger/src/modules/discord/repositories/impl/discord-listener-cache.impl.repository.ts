import { CacheService } from "src/cache/cache.service";
import { DiscordListenerEntity } from "../../entities/discord-listener.entity";
import { DiscordTextChannelListenerDTO } from "../../models/discord-text-channel-listener.dto";
import { DiscordListenerRepository } from "../discord-listener.repository";
import { Inject } from "@nestjs/common";
import { DiscordListenerCacheKeys } from "../keys/discord-listener.cache-keys";

export class DiscordListenerCacheRepositoryImpl
  implements DiscordListenerRepository
{
  private readonly cacheService: CacheService;

  public constructor(@Inject(CacheService) cacheService: CacheService) {
    this.cacheService = cacheService;
  }

  public async saveListener(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<void> {
    const key = DiscordListenerCacheKeys.getListenerKey(listener);
    await this.cacheService.save(key, listener);
  }
  public async deleteListener(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<void> {
    const key = DiscordListenerCacheKeys.getListenerKey(listener);
    await this.cacheService.delete(key);
  }
  public async findListenerByDTO(
    listener: DiscordTextChannelListenerDTO,
  ): Promise<DiscordListenerEntity | undefined> {
    const key = DiscordListenerCacheKeys.getListenerKey(listener);
    return await this.cacheService.get(key);
  }
}
