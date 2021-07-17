import { Router } from 'express';
import CustomerRoutes from '@modules/customer/routes/CustomerRoutes';
import AuthRoutes from '@modules/auth/routes/AuthRoutes';
import FavoriteRoutes from '@modules/favorite/routes/favoriteRoutes';
import authorizedEndPoint from '@shared/middleware/AuthorizedEndPoint';

const routes = Router();

routes.use('/api/customers', CustomerRoutes);
routes.use('/api/login', AuthRoutes);
routes.use('/api/products', authorizedEndPoint, FavoriteRoutes);

export default routes;
