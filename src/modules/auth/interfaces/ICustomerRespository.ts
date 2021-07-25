import Customer from '../typeorm/entities/Customer';

interface ICustomerRepository {
  findByEmail(email: string): Promise<Customer | undefined>;
  create(customer: ICustomerDTO): Promise<Customer>;
}

export default ICustomerRepository;
