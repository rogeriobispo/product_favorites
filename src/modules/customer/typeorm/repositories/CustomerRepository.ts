import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';
import ICustomerRepository from '../../interfaces/ICustomerRepository';
import IcreateCustomerDTO from '../../dtos/IcreateCustomerDTO';

class CustomersRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  async create(customer: IcreateCustomerDTO): Promise<Customer> {
    const customerCreated = this.ormRepository.create(customer);
    await this.ormRepository.save(customerCreated);
    return customerCreated;
  }

  async update(customer: Customer): Promise<Customer> {
    const updatedCustomer = await this.ormRepository.save(customer);
    return updatedCustomer;
  }

  async delete(customer: Customer): Promise<void> {
    this.ormRepository.delete(customer);
  }

  findByEmail(email: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }
}

export default CustomersRepository;
