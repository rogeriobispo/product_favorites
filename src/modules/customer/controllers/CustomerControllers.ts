import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CustomerCreateService from '../services/CreateCustomerService';

class CustomersController {
  public async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const customerCreateService = container.resolve(CustomerCreateService);

    const customer = await customerCreateService.perform({
      name,
      email,
      password,
    });

    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
    });
  }
}

export default new CustomersController();
