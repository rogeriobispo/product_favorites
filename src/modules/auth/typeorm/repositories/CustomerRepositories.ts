import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';
import ICustomerRepository from '../../interfaces/ICustomerRespository';

class CustomersRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  findByEmail(email: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }
}

export default CustomersRepository;
