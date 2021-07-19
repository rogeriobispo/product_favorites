import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';
import ICustomerRepository from '../../interfaces/ICustomerRepository';
import IcreateCustomerDTO from '../../dtos/ICustomerDTO';
import IUpdateCustomerDTO from '../../dtos/IUpdateCustomerDTO';

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

  async update(
    customerID: string,
    customerData: IUpdateCustomerDTO,
  ): Promise<Customer | undefined> {
    await this.ormRepository.update({ id: customerID }, customerData);

    const customer = await this.ormRepository.findOne({ id: customerID });
    return customer;
  }

  async delete(customer: Customer): Promise<void> {
    this.ormRepository.remove(customer);
  }

  findByEmail(email: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }
}

export default CustomersRepository;
