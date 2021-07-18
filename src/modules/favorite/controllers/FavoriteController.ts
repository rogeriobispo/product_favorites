import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateFavoriteProductsServices from '../services/CreateFavoriteProductsServices';
import RemoveFavoriteProductsService from '../services/RemoveFavoriteProductsService';

class FavoriteController {
  public async create(req: Request, res: Response) {
    const { id: customerID } = req.currentUser;

    const { id: productId } = req.params;

    const createFavoriteService = await container.resolve(
      CreateFavoriteProductsServices,
    );

    const product = await createFavoriteService.perform(customerID, productId);

    res.json(product);
  }

  public async destroy(req: Request, res: Response) {
    const { id: customerID } = req.currentUser;

    const { id: productId } = req.params;

    const removeFavoriteService = await container.resolve(
      RemoveFavoriteProductsService,
    );

    const product = await removeFavoriteService.perform(customerID, productId);

    res.json();
  }
}

export default new FavoriteController();
