import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '@server/app';

import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import DeleteCustomerService from '../../services/DeleteCustomerService';

let deleteCustomerService: DeleteCustomerService;
let customerRepository: CustomerRepositoryMock;

describe('DeleteCustomer', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepositoryMock();
    deleteCustomerService = new DeleteCustomerService(customerRepository);
    containerSpy.mockReturnValue(deleteCustomerService);
  });

  it('should delete an existente user', async () => {
    const customerData = {
      name: 'John Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    };

    const customer = await customerRepository.create(customerData);

    const response = await request(app)
      .delete(`/api/customers/${customer.id}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
  });

  it('should throw an error when the user does not exists ', async () => {
    const response = await request(app)
      .delete('/api/customers/doesnotexists')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(404);
  });
});
