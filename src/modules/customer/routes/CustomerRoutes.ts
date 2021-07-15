import { Router } from 'express';
import CustomerControllers from '../controllers/CustomerControllers';

const userRouter = Router();

userRouter.post('/', CustomerControllers.create);

export default userRouter;
