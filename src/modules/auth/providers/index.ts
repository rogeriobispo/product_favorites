import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

import ICustomerRepository from '../interfaces/ICustomerRespository';
import CustomerRepository from '../typeorm/repositories/CustomerRepositories';

import IWebTokenProvider from './WebTokenProvider/model/IwebTokenProvider';
import JsonWebTokenProvider from './WebTokenProvider/implementations/JsonWebTokenProvider';

container.registerSingleton<ICustomerRepository>(
  'AuthCustomerRepository',
  CustomerRepository,
);

container.registerSingleton<IHashProvider>(
  'HashAuthProvider',
  BCryptHashProvider,
);

container.registerSingleton<IWebTokenProvider>(
  'WebTokenProvider',
  JsonWebTokenProvider,
);
