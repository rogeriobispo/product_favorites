import AppError from '@shared/errors/AppErrors';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import DeleteCustomerService from '../../services/DeleteCustomerService';

let deleteCustomerService: DeleteCustomerService;
let customerRepository: CustomerRepositoryMock;

describe('DeleteCustomerService', () => {
  beforeEach(() => {
    customerRepository = new CustomerRepositoryMock();
    deleteCustomerService = new DeleteCustomerService(customerRepository);
  });

  it('should delete an existente user', async () => {
    const customerData = {
      name: 'John Doe',
      email: 'jhondoe@gmail.com',
      password: '123456',
    };

    const customer = await customerRepository.create(customerData);

    const response = await deleteCustomerService.perform(customer.id);

    expect(response).toEqual(true);
    expect(
      await customerRepository.findByEmail('jhondoe@gmail.com'),
    ).toBeUndefined();
  });
  it('should throw an error when the user does not exists ', async () => {
    await expect(
      deleteCustomerService.perform('doesnotexists'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
