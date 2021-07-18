import { Router } from 'express';

import CacheController from '../controllers/CacheController';

const cacheRouter = Router();

cacheRouter.delete('/', CacheController.destroy);

export default cacheRouter;
