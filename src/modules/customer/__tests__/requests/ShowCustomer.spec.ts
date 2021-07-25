import 'reflect-metadata';

import request from 'supertest';
import { container } from 'tsyringe';
import { JwtConfig } from '@config/index';
import jwt from 'jsonwebtoken';

import app from '@server/app';
import connection from '../../../../database/testDB';

import CustomerRepository from '../../typeorm/repositories/CustomerRepository';
import ShowCustomerService from '../../services/ShowCustomerService';
import Customer from '../../typeorm/entities/Customer';

let showCustomerService: ShowCustomerService;
let customerRepository: CustomerRepository;

describe('ShowCustomer', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepository();
    showCustomerService = new ShowCustomerService(customerRepository);
    containerSpy.mockReturnValue(showCustomerService);

    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should return an existente user', async () => {
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
      .get(`/api/customers/${customer.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    const { name, email } = response.body;

    expect(response.statusCode).toBe(200);
    expect(name).toBe('JhonDoe');
    expect(email).toBe('jhon@jhon.com.br');
  });

  it('should throw an error when the user does not exists ', async () => {
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
      .get('/api/customers/doesnotexists')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(403);
  });
});
