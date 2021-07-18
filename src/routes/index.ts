import { Router } from 'express';
import CustomerRoutes from '@modules/customer/routes/CustomerRoutes';
import AuthRoutes from '@modules/auth/routes/AuthRoutes';
import FavoriteRoutes from '@modules/favorite/routes/favoriteRoutes';
import authorizedEndPoint from '@shared/middleware/AuthorizedEndPoint';
import cacheRouter from '@modules/cache/routes/ChacheRoutes';

const routes = Router();

routes.use('/api/customers', CustomerRoutes);
routes.use('/api/login', AuthRoutes);
routes.use('/api/products', authorizedEndPoint, FavoriteRoutes);
routes.use('/api/cache', authorizedEndPoint, cacheRouter);

export default routes;
