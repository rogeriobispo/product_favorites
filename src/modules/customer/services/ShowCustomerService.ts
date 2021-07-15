import 'reflect-metadata';
import AppError from '@shared/errors/AppErrors';
import { injectable, inject } from 'tsyringe';
import ICustomerRepository from '../interfaces/ICustomerRepository';

import Customer from '../typeorm/entities/Customer';

@injectable()
class ShowCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  async perform(customerId: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) throw new AppError('Customer not found', 404);

    return customer;
  }
}

export default ShowCustomerService;
