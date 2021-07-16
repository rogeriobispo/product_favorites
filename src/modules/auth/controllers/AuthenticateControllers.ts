import { Request, Response } from 'express';
import { container } from 'tsyringe';
import AuthenticateCustomerService from '../services/AuthenticateCustomerService';

class AuthenticateController {
  public async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const authService = await container.resolve(AuthenticateCustomerService);

    const token = await authService.perform(email, password);

    res.json(token);
  }
}

export default new AuthenticateController();
