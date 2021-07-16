import 'reflect-metadata';
import AppError from '@shared/errors/AppErrors';
import { injectable, inject } from 'tsyringe';
import ICustomerRepository from '../interfaces/ICustomerRespository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IwebTokenProvider from '../providers/WebTokenProvider/model/IwebTokenProvider';

interface Response {
  token: string;
}

@injectable()
class AuthenticateCustomerService {
  constructor(
    @inject('CustomerRepository')
    private customerRepository: ICustomerRepository,
    @inject('HashAuthProvider')
    private hashProvider: IHashProvider,
    @inject('WebTokenProvider')
    private webTokenProvider: IwebTokenProvider,
  ) {}

  async perform(email: string, password: string): Promise<Response> {
    const customer = await this.customerRepository.findByEmail(email);

    if (!customer) throw new AppError('Unathorized', 401);

    const checkPassword = await this.hashProvider.compareHash(
      password,
      customer.password,
    );

    if (!checkPassword) throw new AppError('Unauthorized', 401);

    const response = {
      token: await this.webTokenProvider.token({
        id: customer.id,
        name: customer.name,
        email: customer.email,
      }),
    };

    return response;
  }
}

export default AuthenticateCustomerService;
