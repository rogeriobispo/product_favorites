import { container } from 'tsyringe';

import IFavoriteProductsRespository from '../interface/IFavoriteProductsRespository';
import FavoriteProductsRepositories from '../typeorm/repositories/FavoriteProductsRepository';

container.registerSingleton<IFavoriteProductsRespository>(
  'FavoriteRepository',
  FavoriteProductsRepositories,
);
