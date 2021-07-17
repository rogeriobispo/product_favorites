import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import { JwtConfig } from '@config/index';
import jwt from 'jsonwebtoken';

import app from '@server/app';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import DeleteCustomerService from '../../services/DeleteCustomerService';
import Customer from '../../typeorm/entities/Customer';

let deleteCustomerService: DeleteCustomerService;
let customerRepository: CustomerRepositoryMock;
let customer: Customer;
let token: string;

describe('DeleteCustomer', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepositoryMock();
    deleteCustomerService = new DeleteCustomerService(customerRepository);
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

    containerSpy.mockReturnValue(deleteCustomerService);
  });

  it('should delete an existente Customer', async () => {
    const response = await request(app)
      .delete(`/api/customers/${customer.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
  });

  it('should throw an error when the user does not exists ', async () => {
    const response = await request(app)
      .delete('/api/customers/doesnotexists')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(404);
  });
});
