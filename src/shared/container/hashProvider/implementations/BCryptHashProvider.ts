import { hash } from 'bcryptjs';
import IHashProvider from '../models/IhashProvider';

class BCryptHashProvider implements IHashProvider {
  public async generateHash(passwd: string): Promise<string> {
    return hash(passwd, 8);
  }
}

export default BCryptHashProvider;
