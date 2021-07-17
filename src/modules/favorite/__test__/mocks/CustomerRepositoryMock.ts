import { v4 as uuidv4 } from 'uuid';
import ICustomerRepository from '../../interface/ICustomerRepository';
import Customer from '../../typeorm/entities/Customer';

const customers: Customer[] = [];

interface ICustomerDTO {
  name: string;
  email: string;
  password: string;
}

class CustomerRepositoryMock implements ICustomerRepository {
  async findById(id: string): Promise<Customer> {
    return customers.filter(customer => customer.id === id)[0];
  }

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
}

export default CustomerRepositoryMock;
