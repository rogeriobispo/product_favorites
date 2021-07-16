import AppError from '@shared/errors/AppErrors';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import UpdateCustomerService from '../../services/UpdateCustomerService';
import HashProvider from '../mocks/HashProviderMock';

let updateCustomerService: UpdateCustomerService;
let customerRepository: CustomerRepositoryMock;
let hashProvider: HashProvider;

describe('UpdateCustomerService', () => {
  beforeEach(() => {
    customerRepository = new CustomerRepositoryMock();
    hashProvider = new HashProvider();
    updateCustomerService = new UpdateCustomerService(
      customerRepository,
      hashProvider,
    );
  });

  it('should update customer', async () => {
    const customerData = {
      name: 'John Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    };

    const customer = await customerRepository.create(customerData);

    const updateData = { name: 'Jane Doe Updated', password: '45231' };

    const updatedCustomer = await updateCustomerService.perform(
      customer.id,
      updateData,
    );

    expect(updatedCustomer.name).toEqual(updateData.name);
    expect(updatedCustomer.email).toEqual(customerData.email);
    expect(updatedCustomer.password).toEqual('hashed:45231');
  });

  it('should throw error if customer not found', async () => {
    await expect(
      updateCustomerService.perform('doesnotexists', { name: 'John Doe' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
