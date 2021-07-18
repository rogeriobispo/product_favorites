import { Router } from 'express';
import AuthorizedEndPoint from '@shared/middleware/AuthorizedEndPoint';
import CustomerControllers from '../controllers/CustomerControllers';
import CustomerPermited from '../middleware/CustomerPermited';

const customerRouter = Router();

customerRouter.post('/', CustomerControllers.create);
customerRouter.delete(
  '/:id',
  AuthorizedEndPoint,
  CustomerPermited,
  CustomerControllers.destroy,
);
customerRouter.get(
  '/:id',
  AuthorizedEndPoint,
  CustomerPermited,
  CustomerControllers.show,
);
customerRouter.patch(
  '/:id',
  AuthorizedEndPoint,
  CustomerPermited,
  CustomerControllers.update,
);

export default customerRouter;
