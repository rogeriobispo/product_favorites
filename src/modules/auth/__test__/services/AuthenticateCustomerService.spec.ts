import AppError from '@shared/errors/AppErrors';
import AuthenticateCustomerService from '../../services/AuthenticateCustomerService';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import JsonWebTokenProviderMock from '../mocks/JsonWebTokenProviderMock';
import HashProviderMock from '../mocks/HashProviderMock';

let authenticateCustomerService: AuthenticateCustomerService;
let customerRepositoryMock: CustomerRepositoryMock;
let hashProviderMock: HashProviderMock;
let jsonWebTokenProviderMock: JsonWebTokenProviderMock;

describe('AuthenticateCustomerService', () => {
  beforeEach(() => {
    customerRepositoryMock = new CustomerRepositoryMock();
    hashProviderMock = new HashProviderMock();
    jsonWebTokenProviderMock = new JsonWebTokenProviderMock();

    authenticateCustomerService = new AuthenticateCustomerService(
      customerRepositoryMock,
      hashProviderMock,
      jsonWebTokenProviderMock,
    );
  });

  describe('perform', () => {
    it('when the user exists and password is right', async () => {
      const customer = await customerRepositoryMock.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
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
      await customerRepositoryMock.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
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
