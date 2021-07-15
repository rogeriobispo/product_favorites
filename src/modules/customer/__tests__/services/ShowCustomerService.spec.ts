import AppError from '@shared/errors/AppErrors';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import ShowCustomerService from '../../services/ShowCustomerService';

let showCustomerService: ShowCustomerService;
let customerRepository: CustomerRepositoryMock;

describe('DeleteCustomerService', () => {
  beforeEach(() => {
    customerRepository = new CustomerRepositoryMock();
    showCustomerService = new ShowCustomerService(customerRepository);
  });

  it('should delete an existente user', async () => {
    const customerData = {
      name: 'John Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    };

    const customer = await customerRepository.create(customerData);

    const response = await showCustomerService.perform(customer.id);

    expect(response).toEqual(customer);
  });
  it('should throw an error when the user does not exists ', async () => {
    await expect(
      showCustomerService.perform('doesnotexists'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
