import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppErrors';
import IHashProvider from '@shared/container/hashProvider/models/IhashProvider';
import IUpdateCustomerDTO from '../dtos/IUpdateCustomerDTO';
import ICustomerRepository from '../interfaces/ICustomerRepository';
import Customer from '../typeorm/entities/Customer';

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async perform(
    customerId: string,
    customerData: IUpdateCustomerDTO,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) throw new AppError('Customer not found', 404);

    if (customerData.password) {
      customerData.password = await this.hashProvider.generateHash(
        customerData.password,
      );
    }

    const updatedCustomer = await this.customerRepository.update(
      customerId,
      customerData,
    );

    return updatedCustomer;
  }
}

export default UpdateCustomerService;
