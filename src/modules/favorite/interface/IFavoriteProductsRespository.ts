import FavoriteProduct from '../typeorm/entities/FavoriteProduct';

interface ICustomerRepository {
  find(
    customerId: string,
    productId: string,
  ): Promise<FavoriteProduct | undefined>;

  create(customerId: string, productId: string): Promise<FavoriteProduct>;

  delete(favoriteProduct: FavoriteProduct): Promise<void>;

  findByCustomerId(customerId: string): Promise<FavoriteProduct[]>;
}

export default ICustomerRepository;
