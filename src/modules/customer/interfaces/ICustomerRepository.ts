import ICustomerDTO from '../dtos/ICustomerDTO';
import IUpdateCustomerDTO from '../dtos/IUpdateCustomerDTO';
import Customer from '../typeorm/entities/Customer';

interface ICustomerRepository {
  create(customer: ICustomerDTO): Promise<Customer>;

  update(
    customerID: string,
    customerData: IUpdateCustomerDTO,
  ): Promise<Customer>;

  delete(customer: Customer): Promise<void>;
  findByEmail(email: string): Promise<Customer | undefined>;
  findById(id: string): Promise<Customer | undefined>;
}

export default ICustomerRepository;
