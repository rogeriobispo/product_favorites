import 'reflect-metadata';
import AppError from '@shared/errors/AppErrors';
import { injectable, inject } from 'tsyringe';

import IFavoriteProductsRespository from '../interface/IFavoriteProductsRespository';

@injectable()
class RemoveFavoriteProductsService {
  constructor(
    @inject('FavoriteRepository')
    private favoriteRepository: IFavoriteProductsRespository,
  ) {}

  async perform(customerId: string, productId: string): Promise<void> {
    const favorite = await this.favoriteRepository.find(customerId, productId);

    if (!favorite) throw new AppError('favorite product not found', 404);

    await this.favoriteRepository.delete(favorite);
  }
}

export default RemoveFavoriteProductsService;
