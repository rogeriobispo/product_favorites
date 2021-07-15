import IcreateCustomerDTO from '../dtos/IcreateCustomerDTO';
import Customer from '../typeorm/entities/Customer';

interface ICustomerRepository {
  create(customer: IcreateCustomerDTO): Promise<Customer>;
  update(customer: Customer): Promise<Customer>;
  delete(customer: Customer): Promise<void>;
  findByEmail(email: string): Promise<Customer | undefined>;
  findById(id: string): Promise<Customer | undefined>;
}

export default ICustomerRepository;
