import { Router } from 'express';
import CustomerControllers from '../controllers/CustomerControllers';

const customerRouter = Router();

customerRouter.post('/', CustomerControllers.create);
customerRouter.delete('/:id', CustomerControllers.destroy);
customerRouter.get('/:id', CustomerControllers.show);
customerRouter.patch('/:id', CustomerControllers.update);

export default customerRouter;
