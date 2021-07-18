import 'reflect-metadata';
import { container } from 'tsyringe';
import request from 'supertest';
import { JwtConfig } from '@config/index';
import jwt from 'jsonwebtoken';

import app from '@server/app';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import UpdateCustomerService from '../../services/UpdateCustomerService';
import HashProvider from '../mocks/HashProviderMock';
import Customer from '../../typeorm/entities/Customer';

let updateCustomerService: UpdateCustomerService;
let customerRepository: CustomerRepositoryMock;
let hashProvider: HashProvider;
let customer: Customer;
let token: string;

describe('UpdateCustomerService', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepositoryMock();
    hashProvider = new HashProvider();
    updateCustomerService = new UpdateCustomerService(
      customerRepository,
      hashProvider,
    );
    customer = await customerRepository.create({
      name: 'JhonDoe',
      email: 'jhon@jhon.com.br',
      password: '123456',
    });

    token = jwt.sign(
      { id: customer.id, name: 'jhondoe', email: 'jhondoe@gmail.com' },
      JwtConfig.secret,
      {
        expiresIn: JwtConfig.expireIn,
      },
    );

    containerSpy.mockReturnValue(updateCustomerService);
  });

  it('should update customer', async () => {
    const updateData = { name: 'Jane Doe Updated', password: '45231' };
    const response = await request(app)
      .patch(`/api/customers/${customer.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .set('Accept', 'application/json');

    const { name, password, email } = response.body;

    expect(response.statusCode).toBe(200);
    expect(name).toBe(updateData.name);
    expect(password).toBe('hashed:45231');
    expect(email).toBe('jhon@jhon.com.br');
  });

  it('should return not found', async () => {
    const response = await request(app)
      .patch('/api/customers/doesnotexists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John Doe' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(403);
  });
});
