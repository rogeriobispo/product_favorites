import 'reflect-metadata';
import AppError from '@shared/errors/AppErrors';
import { injectable, inject } from 'tsyringe';
import ICustomerRepository from '../interfaces/ICustomerRepository';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  async perform(customerId: string): Promise<boolean> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) throw new AppError('Customer not found', 404);

    await this.customerRepository.delete(customer);

    return true;
  }
}

export default DeleteCustomerService;
