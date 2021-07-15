import AppError from '@shared/errors/AppErrors';
import CreateCustomerService from '../../services/CreateCustomerService';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import HashProvider from '../mocks/HashProviderMock';

let createCustomer: CreateCustomerService;
let customerRepository: CustomerRepositoryMock;
let hashProvider: HashProvider;
describe('CreateCustomerService', () => {
  beforeEach(() => {
    customerRepository = new CustomerRepositoryMock();
    hashProvider = new HashProvider();
    createCustomer = new CreateCustomerService(
      customerRepository,
      hashProvider,
    );
  });

  describe('perform', () => {
    it('should create a customer', async () => {
      const customer = await createCustomer.perform({
        name: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password',
      });

      expect(customer).toHaveProperty('id');
      expect(customer.name).toBe('JohnDoe');
      expect(customer.email).toBe('john@doe.com');
    });

    it('should not create with duplicated email customer', async () => {
      const customerData = {
        name: 'JohnDoe4',
        email: 'john@doe4.com',
        password: 'password',
      };

      await createCustomer.perform(customerData);

      await expect(createCustomer.perform(customerData)).rejects.toBeInstanceOf(
        AppError,
      );
    });

    it('should be an hashed password', async () => {
      const customerData = {
        name: 'JohnDoe2',
        email: 'john@doe2.com',
        password: 'password',
      };

      const customer = await createCustomer.perform(customerData);

      expect(customer.password).toBe('hashed:password');
    });
  });
});
