import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import ICacheProvider from '@shared/container/cacheProvider/models/ICacheProvider';

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
