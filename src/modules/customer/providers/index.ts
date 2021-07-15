import { container } from 'tsyringe';

import ICustomerRepository from '../interfaces/ICustomerRepository';
import CustomerRepository from '../typeorm/repositories/CustomerRepository';

container.registerSingleton<ICustomerRepository>(
  'CustomerRepository',
  CustomerRepository,
);
