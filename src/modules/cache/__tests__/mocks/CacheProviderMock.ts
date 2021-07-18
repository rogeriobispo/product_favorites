interface ICacheProvider {
  clear(): Promise<void>;
}

interface ICacheData {
  [key: string]: string;
}

class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async clear(): Promise<void> {
    this.cache = {};
  }
}

export default FakeCacheProvider;
