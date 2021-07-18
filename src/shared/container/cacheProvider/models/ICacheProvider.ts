interface ICacheProvider {
  save<T>(key: string, value: T): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
  clear(): Promise<void>;
}

export default ICacheProvider;
