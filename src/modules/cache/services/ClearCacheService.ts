import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

interface ICacheProvider {
  clear(): Promise<void>;
}

@injectable()
class ClearCacheService {
  constructor(
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  async perform(): Promise<void> {
    await this.cacheProvider.clear();
  }
}

export default ClearCacheService;
