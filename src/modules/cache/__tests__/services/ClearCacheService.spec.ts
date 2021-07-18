import ClearCacheService from '../../services/ClearCacheService';
import CacheProviderMock from '../mocks/CacheProviderMock';

let clearCacheService: ClearCacheService;
let cacheProviderMock: CacheProviderMock;

describe('ClearCacheService', () => {
  beforeEach(() => {
    cacheProviderMock = new CacheProviderMock();

    clearCacheService = new ClearCacheService(cacheProviderMock);
  });

  it('should call invalidate product cache', () => {
    const cacheProviderSpy = jest.spyOn(cacheProviderMock, 'clear');

    clearCacheService.perform();

    expect(cacheProviderSpy).toHaveBeenCalledTimes(1);
  });
});
