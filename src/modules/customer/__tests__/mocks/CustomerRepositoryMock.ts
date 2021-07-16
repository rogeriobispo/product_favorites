import { v4 as uuidv4 } from 'uuid';
import IUpdateCustomerDTO from '@modules/customer/dtos/IUpdateCustomerDTO';
import ICustomerDTO from '../../dtos/ICustomerDTO';
import ICustomerRepository from '../../interfaces/ICustomerRepository';
import Customer from '../../typeorm/entities/Customer';

const customers: Customer[] = [];

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

  async update(
    customerID: string,
    customerDATA: IUpdateCustomerDTO,
  ): Promise<Customer> {
    const customer = customers.find(customerDB => customerDB.id === customerID);

    const index = customers.findIndex(
      customerDB => customerDB.id === customerID,
    );

    const updatedCustomer = { ...customer, ...customerDATA } as Customer;

    customers.splice(index, 1, updatedCustomer);

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
