import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ClearCacheService from '../services/ClearCacheService';

class CacheController {
  public async destroy(req: Request, res: Response) {
    const clearCacheService = await container.resolve(ClearCacheService);

    await clearCacheService.perform();

    res.json();
  }
}

export default new CacheController();
