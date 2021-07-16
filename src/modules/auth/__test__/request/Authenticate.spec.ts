import 'reflect-metadata';
import { container } from 'tsyringe';
import app from '@server/app';
import request from 'supertest';

import AuthenticateCustomerService from '../../services/AuthenticateCustomerService';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import JsonWebTokenProviderMock from '../mocks/JsonWebTokenProviderMock';
import HashProviderMock from '../mocks/HashProviderMock';

let authenticateCustomerService: AuthenticateCustomerService;
let customerRepositoryMock: CustomerRepositoryMock;
let hashProviderMock: HashProviderMock;
let jsonWebTokenProviderMock: JsonWebTokenProviderMock;

describe('Athentication', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepositoryMock = new CustomerRepositoryMock();
    hashProviderMock = new HashProviderMock();
    jsonWebTokenProviderMock = new JsonWebTokenProviderMock();

    authenticateCustomerService = new AuthenticateCustomerService(
      customerRepositoryMock,
      hashProviderMock,
      jsonWebTokenProviderMock,
    );
    containerSpy.mockReturnValue(authenticateCustomerService);
  });

  describe('POST /authenticate', () => {
    it('when the user exists and password is right', async () => {
      const customer = await customerRepositoryMock.create({
        name: 'JhonDoe',
        email: 'jhondoe@jhondoe.com',
        password: '123456',
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
      await customerRepositoryMock.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
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
