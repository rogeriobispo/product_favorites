import { v4 as uuidv4 } from 'uuid';
import ICustomerRepository from '../../interfaces/ICustomerRespository';
import Customer from '../../typeorm/entities/Customer';

const customers: Customer[] = [];

interface ICustomerDTO {
  name: string;
  email: string;
  password: string;
}

class CustomerRepositoryMock implements ICustomerRepository {
  async create(customerParams: ICustomerDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, {
      id: uuidv4(),
      productFavoriteLimite: 10,
      ...customerParams,
    });

    customers.push(customer);

    return customer;
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    return customers.filter(customer => customer.email === email)[0];
  }
}

export default CustomerRepositoryMock;
