import AppError from '@shared/errors/AppErrors';
import connection from '../../../../database/testDB';

import AuthenticateCustomerService from '../../services/AuthenticateCustomerService';
import CustomerRepository from '../../typeorm/repositories/CustomerRepositories';
import JsonWebTokenProviderMock from '../mocks/JsonWebTokenProviderMock';
import HashProviderMock from '../mocks/HashProviderMock';

let authenticateCustomerService: AuthenticateCustomerService;
let customerRepository: CustomerRepository;
let hashProviderMock: HashProviderMock;
let jsonWebTokenProviderMock: JsonWebTokenProviderMock;

describe('AuthenticateCustomerService', () => {
  beforeEach(async () => {
    customerRepository = new CustomerRepository();
    hashProviderMock = new HashProviderMock();
    jsonWebTokenProviderMock = new JsonWebTokenProviderMock();

    authenticateCustomerService = new AuthenticateCustomerService(
      customerRepository,
      hashProviderMock,
      jsonWebTokenProviderMock,
    );
    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('perform', () => {
    it('when the user exists and password is right', async () => {
      const customer = await customerRepository.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
        productFavoriteLimite: 10,
      });
      const response = await authenticateCustomerService.perform(
        customer.email,
        customer.password,
      );

      expect(response).toStrictEqual({
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

      await expect(
        authenticateCustomerService.perform(
          'jhon@jhon.com.br',
          'wrongpassword',
        ),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('when the customer does not exists', async () => {
      await expect(
        authenticateCustomerService.perform('does not exists', '123456'),
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
