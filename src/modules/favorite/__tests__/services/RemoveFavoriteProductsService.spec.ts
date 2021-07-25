import AppError from '@shared/errors/AppErrors';
import connection from '../../../../database/testDB';

import RemoveFavoriteProductsService from '../../services/RemoveFavoriteProductsService';
import FavoriteProductsRepositoryMock from '../../typeorm/repositories/FavoriteProductsRepository';

let removeFavoriteProductsService: RemoveFavoriteProductsService;
let favoriteProductsRepositoryMock: FavoriteProductsRepositoryMock;

describe('RemoveFavoriteProductsService', () => {
  beforeEach(async () => {
    favoriteProductsRepositoryMock = new FavoriteProductsRepositoryMock();
    removeFavoriteProductsService = new RemoveFavoriteProductsService(
      favoriteProductsRepositoryMock,
    );
    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });
  it('should remove favorite products with the customer and the product is favorited', async () => {
    const favoriteRepoMockSpy = jest.spyOn(
      favoriteProductsRepositoryMock,
      'delete',
    );
    const productId = 'aae4fa86-ca9b-4b31-b6ad-4d655f0dfd07';
    const customerId = 'aae4fa86-ca9b-4b31-b6ad-4d655f0dfd08';

    const favorite = await favoriteProductsRepositoryMock.create(
      customerId,
      productId,
    );

    await removeFavoriteProductsService.perform(customerId, productId);

    expect(favoriteRepoMockSpy).toHaveBeenCalledTimes(1);
    expect(favoriteRepoMockSpy).toHaveBeenCalledWith(favorite);
  });

  it('should thrown an error when the pair value customer/product does not exists', async () => {
    const productId = 'aae4fa86-ca9b-4b31-b6ad-4d655f0dfd07';
    const customerId = 'aae4fa86-ca9b-4b31-b6ad-4d655f0dfd08';

    await expect(
      removeFavoriteProductsService.perform(customerId, productId),
    ).rejects.toBeInstanceOf(AppError);
  });
});
