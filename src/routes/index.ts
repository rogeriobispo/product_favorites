import { Router } from 'express';
import CustomerRoutes from '@modules/customer/routes/CustomerRoutes';

const routes = Router();

routes.use('/api/customers', CustomerRoutes);

export default routes;
