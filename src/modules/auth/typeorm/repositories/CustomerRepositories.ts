import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';
import ICustomerRepository from '../../interfaces/ICustomerRespository';
import IcreateCustomerDTO from '../../dtos/ICustomerDTO';

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

  findByEmail(email: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }
}

export default CustomersRepository;
