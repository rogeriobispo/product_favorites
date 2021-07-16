import 'reflect-metadata';
import { container } from 'tsyringe';
import request from 'supertest';

import app from '@server/app';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import UpdateCustomerService from '../../services/UpdateCustomerService';
import HashProvider from '../mocks/HashProviderMock';

let updateCustomerService: UpdateCustomerService;
let customerRepository: CustomerRepositoryMock;
let hashProvider: HashProvider;

describe('UpdateCustomerService', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepositoryMock();
    hashProvider = new HashProvider();
    updateCustomerService = new UpdateCustomerService(
      customerRepository,
      hashProvider,
    );
    containerSpy.mockReturnValue(updateCustomerService);
  });

  it('should update customer', async () => {
    const customerData = {
      name: 'John Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    };

    const customer = await customerRepository.create(customerData);

    const updateData = { name: 'Jane Doe Updated', password: '45231' };
    const response = await request(app)
      .patch(`/api/customers/${customer.id}`)
      .send(updateData)
      .set('Accept', 'application/json');

    const { name, password, email } = response.body;

    expect(response.statusCode).toBe(200);
    expect(name).toBe(updateData.name);
    expect(password).toBe('hashed:45231');
    expect(email).toBe(customerData.email);
  });

  it('should return not found', async () => {
    const response = await request(app)
      .patch('/api/customers/doesnotexists')
      .send({ name: 'John Doe' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(404);
  });
});
