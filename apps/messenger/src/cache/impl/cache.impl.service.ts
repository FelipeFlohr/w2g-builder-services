import { Inject, OnModuleInit } from "@nestjs/common";
import { CacheService } from "../cache.service";
import { EnvironmentSettingsService } from "src/env/environment-settings.service";
import {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
  createClient,
} from "redis";
import { TypeUtils } from "src/utils/type-utils";
import { LoggerUtils } from "src/utils/logger-utils";

export class RedisCacheServiceImpl implements CacheService, OnModuleInit {
  private readonly env: EnvironmentSettingsService;
  private readonly prefix: string;
  private readonly logger = LoggerUtils.from(RedisCacheServiceImpl);
  private client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  public constructor(
    @Inject(EnvironmentSettingsService) env: EnvironmentSettingsService,
  ) {
    this.env = env;
    this.prefix = this.getCacheKeyPrefix();
  }

  public async onModuleInit(): Promise<void> {
    const redisUrl = new URL(`redis://${this.env.redis.host}`);
    redisUrl.port = this.env.redis.port.toString();
    if (this.env.redis.password) redisUrl.password = this.env.redis.password;

    this.client = await this.createClient(redisUrl);
  }

  public async save<T>(key: string, value: T): Promise<boolean> {
    key = this.getParsedKey(key);

    const val = this.serialize(value);
    if (val) {
      const res = await this.client.set(key, val);
      this.logger.debug(`Saved value with key ${key}`);
      return res != null;
    }

    return false;
  }

  public async get<T>(key: string): Promise<T | undefined> {
    const val = await this.getAsString(key);
    if (val) {
      return JSON.parse(val) as T;
    }
  }

  public async getAsString(key: string): Promise<string | undefined> {
    key = this.getParsedKey(key);

    const value = await this.client.get(key);
    if (value) {
      this.logger.debug(`Retrieved value with key ${key}`);
    }

    return TypeUtils.parseNullToUndefined(value);
  }

  public async delete(key: string): Promise<boolean> {
    key = this.getParsedKey(key);

    const res = await this.client.del(key);
    this.logger.debug(`Deleted value with key ${key}`);
    return res > 0;
  }

  private createClient(
    url: URL,
  ): Promise<RedisClientType<RedisModules, RedisFunctions, RedisScripts>> {
    this.logger.debug("Creating Redis instance.");

    return new Promise(async (res, rej) => {
      const client = await createClient({
        url: url.toString(),
      })
        .on("error", (err) => {
          this.logger.fatal(err);
          rej(err);
        })
        .connect();

      this.logger.debug("Created Redis instance.");
      return res(client);
    });
  }

  private getCacheKeyPrefix(): string {
    return `${this.env.application.name.toUpperCase()}|${
      this.env.database.name
    }|`;
  }

  private serialize<T>(obj: T): string | undefined {
    try {
      const res = JSON.stringify(obj);
      if (res == "") return;
      return res;
    } catch (e) {
      return `${obj}`;
    }
  }

  private getParsedKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}
