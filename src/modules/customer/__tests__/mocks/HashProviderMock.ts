import IHashProvider from '@shared/container/hashProvider/models/IhashProvider';

class HashProviderMock implements IHashProvider {
  public async generateHash(passwd: string): Promise<string> {
    return `hashed:${passwd}`;
  }
}

export default HashProviderMock;
