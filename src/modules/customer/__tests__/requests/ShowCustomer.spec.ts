import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '@server/app';

import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import ShowCustomerService from '../../services/ShowCustomerService';

let showCustomerService: ShowCustomerService;
let customerRepository: CustomerRepositoryMock;

describe('ShowCustomer', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepositoryMock();
    showCustomerService = new ShowCustomerService(customerRepository);
    containerSpy.mockReturnValue(showCustomerService);
  });

  it('should return an existente user', async () => {
    const customerData = {
      name: 'John Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    };

    const customer = await customerRepository.create(customerData);

    const response = await request(app)
      .get(`/api/customers/${customer.id}`)
      .set('Accept', 'application/json');

    const { name, email } = response.body;

    expect(response.statusCode).toBe(200);
    expect(name).toBe(customerData.name);
    expect(email).toBe(customerData.email);
  });

  it('should throw an error when the user does not exists ', async () => {
    const response = await request(app)
      .get('/api/customers/doesnotexists')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(404);
  });
});
