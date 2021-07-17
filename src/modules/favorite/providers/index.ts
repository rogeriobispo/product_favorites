import { container } from 'tsyringe';

import IFavoriteProductsRespository from '../interface/IFavoriteProductsRespository';
import FavoriteProductsRepositories from '../typeorm/repositories/FavoriteProductsRepository';

import ICustomerRepository from '../interface/ICustomerRepository';
import CustomerRepository from '../typeorm/repositories/CustomerRepository';

container.registerSingleton<IFavoriteProductsRespository>(
  'FavoriteRepository',
  FavoriteProductsRepositories,
);

container.registerSingleton<ICustomerRepository>(
  'FavoriteCustomerRepository',
  CustomerRepository,
);
