import Customer from '../typeorm/entities/Customer';

interface ICustomerRepository {
  findByEmail(email: string): Promise<Customer | undefined>;
}

export default ICustomerRepository;
