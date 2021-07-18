import Redis, { Redis as RedisClient } from 'ioredis';
import { RedisConfig, RedisTTLConfig } from '@config/index';
import ICacheProvider from '../models/ICacheProvider';

class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(RedisConfig.config.redis);
  }

  public async save<T>(key: string, value: T): Promise<void> {
    this.client.set(
      key,
      JSON.stringify(value),
      RedisTTLConfig.type,
      RedisTTLConfig.expireIn,
    );
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async clear(): Promise<void> {
    await this.client.flushall();
  }
}

export default RedisCacheProvider;
