import { Router } from 'express';
import AuthenticateController from '../controllers/AuthenticateControllers';

const userRouter = Router();

userRouter.post('/', AuthenticateController.create);

export default userRouter;
