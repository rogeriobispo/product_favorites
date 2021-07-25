import AppError from '@shared/errors/AppErrors';
import connection from '../../../../database/testDB';

import CustomerRepository from '../../typeorm/repositories/CustomerRepository';
import DeleteCustomerService from '../../services/DeleteCustomerService';

let deleteCustomerService: DeleteCustomerService;
let customerRepository: CustomerRepository;

describe('DeleteCustomerService', () => {
  beforeEach(async () => {
    customerRepository = new CustomerRepository();
    deleteCustomerService = new DeleteCustomerService(customerRepository);

    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should delete an existente user', async () => {
    const customerData = {
      name: 'John Doe Delete',
      email: 'jhondoedelete@gmail.com',
      password: '123456',
    };

    const customer = await customerRepository.create(customerData);

    const response = await deleteCustomerService.perform(customer.id);

    const customerDeleted = await customerRepository.findByEmail(
      'jhondoedelete@gmail.com',
    );

    expect(response).toEqual(true);
    expect(customerDeleted).toBeUndefined();
  });
  it('should throw an error when the customer does not exists ', async () => {
    await expect(
      deleteCustomerService.perform('doesnotexists'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
