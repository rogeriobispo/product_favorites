import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CustomerCreateService from '../services/CreateCustomerService';
import CustomeDeleteService from '../services/DeleteCustomerService';
import ShowCustomerService from '../services/ShowCustomerService';
import UpdateCustomerService from '../services/UpdateCustomerService';
import IUpdateCustomerDTO from '../dtos/IUpdateCustomerDTO';

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

    const showCustomerService = await container.resolve(ShowCustomerService);

    const customer = await showCustomerService.perform(id);

    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
    });
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    const customeDeleteService = await container.resolve(CustomeDeleteService);

    const response = await customeDeleteService.perform(id);

    res.json(response);
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;

    const { name, email, password } = req.body;

    const data = {
      name,
      email,
      password,
    };

    const updateData = Object.entries(data).reduce(
      (a, [k, v]) => (v ? (Object.assign(a, { [k]: v }), a) : a),
      {},
    );

    const customerUpdateService = await container.resolve(
      UpdateCustomerService,
    );

    const response = await customerUpdateService.perform(id, updateData);

    res.json(response);
  }
}

export default new CustomersController();
