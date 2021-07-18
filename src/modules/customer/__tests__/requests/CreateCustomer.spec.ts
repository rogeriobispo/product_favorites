import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';

import app from '@server/app';
import CreateCustomerService from '@modules/customer/services/CreateCustomerService';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import HashProvider from '../mocks/HashProviderMock';

let createCustomer: CreateCustomerService;
let customerRepository: CustomerRepositoryMock;
let hashProvider: HashProvider;
describe('CreateCustomer', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepositoryMock();
    hashProvider = new HashProvider();
    createCustomer = new CreateCustomerService(
      customerRepository,
      hashProvider,
    );

    containerSpy.mockReturnValue(createCustomer);
  });

  describe('perform', () => {
    it('should create a customer', async () => {
      const customerData = {
        name: 'JohnDoe2',
        email: 'john@doe.com',
        password: 'password',
      };

      const response = await request(app)
        .post('/api/customers')
        .send(customerData)
        .set('Accept', 'application/json');

      const { name, email } = response.body;

      expect(response.statusCode).toBe(200);
      expect(name).toEqual('JohnDoe2');
      expect(email).toEqual('john@doe.com');
    });

    it('should not create with duplicated email customer', async () => {
      const customerData = {
        name: 'JohnDoe3',
        email: 'john@doe3.com',
        password: 'password',
      };

      await createCustomer.perform(customerData);

      const response = await request(app)
        .post('/api/customers')
        .send(customerData)
        .set('Accept', 'application/json');
      const expectedResponse = {
        message: 'Email Already taken',
      };

      expect(response.status).toEqual(422);
      expect(response.body).toEqual(expectedResponse);
    });

    it('should not return password', async () => {
      const customerData = {
        name: 'JohnDoe2',
        email: 'john@doe2.com',
        password: 'password',
      };

      const response = await request(app)
        .post('/api/customers')
        .send(customerData)
        .set('Accept', 'application/json');

      const { password } = response.body;

      expect(response.statusCode).toBe(200);
      expect(password).toBeUndefined();
    });

    it('mandatory fields', async () => {
      const customerData = {};
      const response = await request(app)
        .post('/api/customers')
        .send(customerData.toString())
        .set('Accept', 'application/json');
      const expectedResponse = {
        message: 'Name, Email, password are mandatory',
      };

      expect(response.status).toEqual(422);
      expect(response.body).toEqual(expectedResponse);
    });
  });
});
