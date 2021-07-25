import AppError from '@shared/errors/AppErrors';
import connection from '../../../../database/testDB';

import CustomerRepository from '../../typeorm/repositories/CustomerRepository';
import ShowCustomerService from '../../services/ShowCustomerService';

let showCustomerService: ShowCustomerService;
let customerRepository: CustomerRepository;

describe('ShowCustomerService', () => {
  beforeEach(async () => {
    customerRepository = new CustomerRepository();
    showCustomerService = new ShowCustomerService(customerRepository);

    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should show an existente user', async () => {
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
