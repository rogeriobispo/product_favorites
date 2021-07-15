import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CustomerCreateService from '../services/CreateCustomerService';
import CustomeDeleteService from '../services/DeleteCustomerService';

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

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;

    const customeDeleteService = await container.resolve(CustomeDeleteService);

    const response = await customeDeleteService.perform(id);

    res.json(response);
  }
}

export default new CustomersController();
