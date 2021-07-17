import { Request, Response } from 'express';
import { container } from 'tsyringe';
import createFavoriteProductsServices from '../services/CreateFavoriteProductsServices';

class FavoriteController {
  public async create(req: Request, res: Response) {
    const { id: customerID } = req.currentUser;

    const { id: productId } = req.params;

    const authService = await container.resolve(createFavoriteProductsServices);

    const product = await authService.perform(customerID, productId);

    res.json(product);
  }
}

export default new FavoriteController();
