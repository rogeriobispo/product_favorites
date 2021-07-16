import { Router } from 'express';
import CustomerControllers from '../controllers/CustomerControllers';

const userRouter = Router();

userRouter.post('/', CustomerControllers.create);
userRouter.delete('/:id', CustomerControllers.destroy);
userRouter.get('/:id', CustomerControllers.show);
userRouter.patch('/:id', CustomerControllers.update);

export default userRouter;
