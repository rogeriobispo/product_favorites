import 'reflect-metadata';
import { container } from 'tsyringe';
import request from 'supertest';
import { JwtConfig } from '@config/index';
import jwt from 'jsonwebtoken';

import app from '@server/app';
import connection from '../../../../database/testDB';

import CustomerRepositoryMock from '../../typeorm/repositories/CustomerRepository';
import UpdateCustomerService from '../../services/UpdateCustomerService';
import HashProvider from '../mocks/HashProviderMock';

let updateCustomerService: UpdateCustomerService;
let customerRepository: CustomerRepositoryMock;
let hashProvider: HashProvider;

describe('UpdateCustomerService', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepositoryMock();
    hashProvider = new HashProvider();
    updateCustomerService = new UpdateCustomerService(
      customerRepository,
      hashProvider,
    );

    containerSpy.mockReturnValue(updateCustomerService);
    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should update customer', async () => {
    const customer = await customerRepository.create({
      name: 'JhonDoe',
      email: 'jhon@jhon.com.br',
      password: '123456',
    });

    const token = jwt.sign(
      { id: customer.id, name: 'jhondoe', email: 'jhondoe@gmail.com' },
      JwtConfig.secret,
      {
        expiresIn: JwtConfig.expireIn,
      },
    );

    const updateData = { name: 'Jane Doe Updated', password: '45231' };
    const response = await request(app)
      .patch(`/api/customers/${customer.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .set('Accept', 'application/json');

    const { name, email } = response.body;

    expect(response.statusCode).toBe(200);
    expect(name).toBe(updateData.name);
    expect(email).toBe('jhon@jhon.com.br');
  });

  it('should update customer with put', async () => {
    const customer = await customerRepository.create({
      name: 'JhonDoe',
      email: 'jhon@jhon.com.br',
      password: '123456',
    });

    const token = jwt.sign(
      { id: customer.id, name: 'jhondoe', email: 'jhondoe@gmail.com' },
      JwtConfig.secret,
      {
        expiresIn: JwtConfig.expireIn,
      },
    );

    const updateData = { name: 'Jane Doe Updated', password: '45231' };
    const response = await request(app)
      .put(`/api/customers/${customer.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateData)
      .set('Accept', 'application/json');

    const { name, email } = response.body;

    expect(response.statusCode).toBe(200);
    expect(name).toBe(updateData.name);
    expect(email).toBe('jhon@jhon.com.br');
  });

  it('should return not found', async () => {
    const customer = await customerRepository.create({
      name: 'JhonDoe',
      email: 'jhon@jhon.com.br',
      password: '123456',
    });

    const token = jwt.sign(
      { id: customer.id, name: 'jhondoe', email: 'jhondoe@gmail.com' },
      JwtConfig.secret,
      {
        expiresIn: JwtConfig.expireIn,
      },
    );

    const response = await request(app)
      .patch('/api/customers/doesnotexists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'John Doe' })
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(403);
  });
});
