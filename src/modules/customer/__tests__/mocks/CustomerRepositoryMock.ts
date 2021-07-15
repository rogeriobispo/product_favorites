import { v4 as uuidv4 } from 'uuid';
import IcreateCustomerDTO from '../../dtos/IcreateCustomerDTO';
import ICustomerRepository from '../../interfaces/ICustomerRepository';
import Customer from '../../typeorm/entities/Customer';

const customers: Customer[] = [];

class CustomerRepositoryMock implements ICustomerRepository {
  async create(customerParams: IcreateCustomerDTO): Promise<Customer> {
    const customer = new Customer();

    Object.assign(customer, {
      id: uuidv4(),
      productFavoriteLimite: 10,
      ...customerParams,
    });

    customers.push(customer);

    return customer;
  }

  async update(customer: Customer): Promise<Customer> {
    const index = customers.findIndex(
      customerDB => customerDB.id === customer.id,
    );

    customers.splice(index, 1, customer);

    return customers[index];
  }

  async delete(customer: Customer): Promise<void> {
    const index = customers.findIndex(
      customerDB => customerDB.id === customer.id,
    );

    customers.splice(index, 1);
  }

  async findByEmail(email: string): Promise<Customer | undefined> {
    return customers.filter(customer => customer.email === email)[0];
  }

  async findById(id: string): Promise<Customer | undefined> {
    return customers.filter(customer => customer.id === id)[0];
  }
}

export default CustomerRepositoryMock;
