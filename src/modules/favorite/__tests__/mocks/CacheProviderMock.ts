import ICacheProvider from '@shared/container/cacheProvider/models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save<T>(key: string, value: T): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (!data) return null;

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async clear(): Promise<void> {
    this.cache = {};
  }
}

export default FakeCacheProvider;
