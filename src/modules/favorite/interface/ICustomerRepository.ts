import Customer from '../typeorm/entities/Customer';
import ICustomerDTO from '../dtos/ICustomerDTO';

interface ICustomerRepository {
  findById(id: string): Promise<Customer | undefined>;
  create(customer: ICustomerDTO): Promise<Customer>;
}

export default ICustomerRepository;
