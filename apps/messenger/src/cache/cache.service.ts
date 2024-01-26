export interface CacheService {
  save<T>(key: string, value: T): Promise<boolean>;
  get<T>(key: string): Promise<T | undefined>;
  getAsString(key: string): Promise<string | undefined>;
  delete(key: string): Promise<boolean>;
}

export const CacheService = Symbol("CacheService");
