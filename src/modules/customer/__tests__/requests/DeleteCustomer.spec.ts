import 'reflect-metadata';

import request from 'supertest';
import { container } from 'tsyringe';
import { JwtConfig } from '@config/index';
import jwt from 'jsonwebtoken';

import app from '@server/app';
import connection from '../../../../database/testDB';
import CustomerRepository from '../../typeorm/repositories/CustomerRepository';
import DeleteCustomerService from '../../services/DeleteCustomerService';
import Customer from '../../typeorm/entities/Customer';

let deleteCustomerService: DeleteCustomerService;
let customerRepository: CustomerRepository;

describe('DeleteCustomer', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepository();
    deleteCustomerService = new DeleteCustomerService(customerRepository);

    containerSpy.mockReturnValue(deleteCustomerService);

    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should delete an existente Customer', async () => {
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
      .delete(`/api/customers/${customer.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
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
      .delete('/api/customers/doesnotexists')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(403);
  });
});
