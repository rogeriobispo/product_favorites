import Customer from '../typeorm/entities/Customer';

interface ICustomerRepository {
  findById(id: string): Promise<Customer | undefined>;
}

export default ICustomerRepository;
