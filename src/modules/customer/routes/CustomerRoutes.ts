import { Router } from 'express';
import AuthorizedEndPoint from '@shared/middleware/AuthorizedEndPoint';
import CustomerControllers from '../controllers/CustomerControllers';

const customerRouter = Router();

customerRouter.post('/', CustomerControllers.create);
customerRouter.delete('/:id', AuthorizedEndPoint, CustomerControllers.destroy);
customerRouter.get('/:id', AuthorizedEndPoint, CustomerControllers.show);
customerRouter.patch('/:id', AuthorizedEndPoint, CustomerControllers.update);

export default customerRouter;
