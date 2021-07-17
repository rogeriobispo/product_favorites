import { getRepository, Repository } from 'typeorm';
import FavoriteProduct from '../entities/FavoriteProduct';
import IFavoriteProductsRespository from '../../interface/IFavoriteProductsRespository';

class FavoriteProductsRepository implements IFavoriteProductsRespository {
  private ormRepository: Repository<FavoriteProduct>;

  constructor() {
    this.ormRepository = getRepository(FavoriteProduct);
  }

  async findByCustomerId(customerId: string): Promise<FavoriteProduct[]> {
    const favorites = await this.ormRepository.find({ where: { customerId } });
    return favorites;
  }

  async delete(favoriteProduct: FavoriteProduct): Promise<void> {
    this.ormRepository.delete(favoriteProduct);
  }

  async find(
    customerId: string,
    productId: string,
  ): Promise<FavoriteProduct | undefined> {
    return this.ormRepository.findOne({ where: { customerId, productId } });
  }

  async create(
    customerId: string,
    productId: string,
  ): Promise<FavoriteProduct> {
    const favoriteCreated = this.ormRepository.create({
      customerId,
      productId,
    });
    await this.ormRepository.save(favoriteCreated);
    return favoriteCreated;
  }
}

export default FavoriteProductsRepository;
