import { Router } from 'express';
import FavoriteController from '../controllers/FavoriteController';

const favoriteRouter = Router();

favoriteRouter.post('/:id/favorite', FavoriteController.create);

export default favoriteRouter;
