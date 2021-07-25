import 'reflect-metadata';

import { container } from 'tsyringe';
import app from '@server/app';
import request from 'supertest';
import connection from '../../../../database/testDB';

import AuthenticateCustomerService from '../../services/AuthenticateCustomerService';
import CustomerRepository from '../../typeorm/repositories/CustomerRepositories';
import JsonWebTokenProviderMock from '../mocks/JsonWebTokenProviderMock';
import HashProviderMock from '../mocks/HashProviderMock';

let authenticateCustomerService: AuthenticateCustomerService;
let customerRepository: CustomerRepository;
let hashProviderMock: HashProviderMock;
let jsonWebTokenProviderMock: JsonWebTokenProviderMock;

describe('Athentication', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepository = new CustomerRepository();
    hashProviderMock = new HashProviderMock();
    jsonWebTokenProviderMock = new JsonWebTokenProviderMock();

    authenticateCustomerService = new AuthenticateCustomerService(
      customerRepository,
      hashProviderMock,
      jsonWebTokenProviderMock,
    );
    containerSpy.mockReturnValue(authenticateCustomerService);
    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('POST /authenticate', () => {
    it('when the user exists and password is right', async () => {
      const customer = await customerRepository.create({
        name: 'JhonDoe',
        email: 'jhondoe@jhondoe.com',
        password: '123456',
        productFavoriteLimite: 10,
      });

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'jhondoe@jhondoe.com',
          password: '123456',
        })
        .set('Accept', 'application/json');

      expect(response.status).toEqual(200);
      expect(response.body).toStrictEqual({
        token: `${customer.id}, ${customer.name}, ${customer.email}:token`,
      });
    });
    it('when the user exists and password is wrong', async () => {
      await customerRepository.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
        productFavoriteLimite: 10,
      });

      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'jhondoe@jhondoe.com',
          password: 'wrongpassword',
        })
        .set('Accept', 'application/json');

      expect(response.status).toEqual(401);
    });

    it('when the customer does not exists', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          email: 'jhondoe@noexists',
          password: 'wrongpassword',
        })
        .set('Accept', 'application/json');

      expect(response.status).toEqual(401);
    });
  });
});
