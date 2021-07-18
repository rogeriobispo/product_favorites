import { v4 as uuidv4 } from 'uuid';
import FavoriteProduct from '@modules/favorite/typeorm/entities/FavoriteProduct';
import IFavoriteProductsRespository from '../../interface/IFavoriteProductsRespository';

const favoriteProducts: FavoriteProduct[] = [];

for (let i = 0; i < 10; i += 1) {
  const favorite = new FavoriteProduct();

  Object.assign(favorite, {
    id: uuidv4(),
    customerId: 'a3fb22be-efbb-4375-adcf-1cc92953b88c',
    productId: uuidv4(),
  });

  favoriteProducts.push(favorite);
}

class FavoriteProductsRepository implements IFavoriteProductsRespository {
  async findByCustomerId(customerId: string): Promise<FavoriteProduct[]> {
    return favoriteProducts.filter(
      favorite => favorite.customerId === customerId,
    );
  }

  async find(
    customerId: string,
    productId: string,
  ): Promise<FavoriteProduct | undefined> {
    return favoriteProducts.filter(
      favorite =>
        favorite.customerId === customerId && favorite.productId === productId,
    )[0];
  }

  async create(
    customerId: string,
    productId: string,
  ): Promise<FavoriteProduct> {
    const favorite = new FavoriteProduct();

    Object.assign(favorite, {
      id: uuidv4(),
      customerId,
      productId,
    });

    favoriteProducts.push(favorite);

    return favorite;
  }

  async delete(favoriteProduct: FavoriteProduct): Promise<void> {
    const index = favoriteProducts.findIndex(
      favorite =>
        favorite.customerId === favoriteProduct.customerId &&
        favorite.productId === favoriteProduct.productId,
    );

    favoriteProducts.splice(index, 1);
  }
}

export default FavoriteProductsRepository;
