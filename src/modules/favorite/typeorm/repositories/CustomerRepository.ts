import { getRepository, Repository } from 'typeorm';
import Customer from '../entities/Customer';
import ICustomerRepository from '../../interface/ICustomerRepository';

class CustomersRepository implements ICustomerRepository {
  private ormRepository: Repository<Customer>;

  constructor() {
    this.ormRepository = getRepository(Customer);
  }

  findById(id: string): Promise<Customer | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }
}

export default CustomersRepository;
