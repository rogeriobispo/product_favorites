import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppErrors';
import IHashProvider from '@shared/container/hashProvider/models/IhashProvider';
import ICustomerRepository from '../interfaces/ICustomerRepository';
import IcreateCustomerDTO from '../dtos/IcreateCustomerDTO';
import Customer from '../typeorm/entities/Customer';

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async perform({
    name,
    email,
    password,
  }: IcreateCustomerDTO): Promise<Customer> {
    if (!name || !email || !password)
      throw new AppError('Name, Email, password are mandatory');

    const existsEmail = await this.customerRepository.findByEmail(email);

    if (existsEmail) throw new AppError('Email Already taken');

    const hashedPassword = await this.hashProvider.generateHash(password);

    const customerEntity = this.customerRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return customerEntity;
  }
}

export default CreateCustomerService;
