import { Router } from 'express';
import CustomerRoutes from '@modules/customer/routes/CustomerRoutes';
import AuthRoutes from '@modules/auth/routes/AuthRoutes';

const routes = Router();

routes.use('/api/customers', CustomerRoutes);
routes.use('/api/login', AuthRoutes);

export default routes;
