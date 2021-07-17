import AppError from '@shared/errors/AppErrors';
import CreateFavoriteProductsService from '../../services/CreateFavoriteProductsServices';
import FavoriteProductsRepositoryMock from '../mocks/FavoriteProductsRepositoriesMock';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import HttpRequestProviderMock from '../mocks/HttpRequestProviderMock';
import CacheProviderMock from '../mocks/CacheProviderMock';

let createFavoriteProductsService: CreateFavoriteProductsService;
let favoriteProductsRepositoryMock: FavoriteProductsRepositoryMock;
let httpRequestProviderMock: HttpRequestProviderMock;
let cacheProviderMock: CacheProviderMock;
let customerRepositoryMock: CustomerRepositoryMock;

describe('CreateFavoriteProductsService', () => {
  beforeEach(() => {
    favoriteProductsRepositoryMock = new FavoriteProductsRepositoryMock();
    httpRequestProviderMock = new HttpRequestProviderMock();
    cacheProviderMock = new CacheProviderMock();
    customerRepositoryMock = new CustomerRepositoryMock();
    createFavoriteProductsService = new CreateFavoriteProductsService(
      favoriteProductsRepositoryMock,
      httpRequestProviderMock,
      cacheProviderMock,
      customerRepositoryMock,
    );
  });

  describe('perform', () => {
    it('when the product exist and is not in the list should favorite', async () => {
      const repoSpy = jest.spyOn(favoriteProductsRepositoryMock, 'create');

      const customer = await customerRepositoryMock.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
      });

      const customerId = customer.id;
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';

      const expectedResponse = {
        price: 149.9,
        image:
          'http://challenge-api.luizalabs.com/images/65050878-a949-1b0f-1b0a-df469d1e479a.jpg',
        brand: 'telltale games',
        id: '65050878-a949-1b0f-1b0a-df469d1e479a',
        title: 'The Walking Dead - Season 2 para PS4',
      };

      const response = await createFavoriteProductsService.perform(
        customerId,
        productId,
      );

      expect(repoSpy).toHaveBeenCalledTimes(1);
      expect(repoSpy).toHaveBeenCalledWith(customerId, productId);
      expect(response).toEqual(expectedResponse);
    });

    it('when the product does not exist should return an error', async () => {
      const customer = await customerRepositoryMock.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
      });
      const productId = 'deccc895-cbf1-4946-bf07-4c96048fa485';
      const customerId = customer.id;

      await expect(
        createFavoriteProductsService.perform(customerId, productId),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('when the customer does not exists', async () => {
      const productId = 'a96b5916-9109-5d2e-138a-7b656efe1f92';
      const customerId = 'doesnotexistscustomer';

      await expect(
        createFavoriteProductsService.perform(customerId, productId),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should not let add more than limit set to customer default 10', async () => {
      const productId = '5f1cb9b0-46c4-35a3-7b52-030c76dd8b08';
      const customerId = 'a3fb22be-efbb-4375-adcf-1cc92953b88c';

      await expect(
        createFavoriteProductsService.perform(customerId, productId),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('when the product is already on the list of favorite', async () => {
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';
      const customerId = 'a3fb22be-efbb-4375-adcf-1cc92953b88c';

      await favoriteProductsRepositoryMock.create(customerId, productId);

      await expect(
        createFavoriteProductsService.perform(customerId, productId),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should save on cache products searched', async () => {
      const cacheSpy = jest.spyOn(cacheProviderMock, 'save');

      const customer = await customerRepositoryMock.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
      });

      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';
      const customerId = customer.id;

      const product = {
        price: 149.9,
        image:
          'http://challenge-api.luizalabs.com/images/65050878-a949-1b0f-1b0a-df469d1e479a.jpg',
        brand: 'telltale games',
        id: '65050878-a949-1b0f-1b0a-df469d1e479a',
        title: 'The Walking Dead - Season 2 para PS4',
      };

      await createFavoriteProductsService.perform(customerId, productId);

      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(cacheSpy).toHaveBeenCalledWith(productId, product);
    });
    it('should get products on chached products', async () => {
      const httpRequestProviderSpy = jest.spyOn(httpRequestProviderMock, 'get');

      const customer = await customerRepositoryMock.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
      });

      const product = {
        price: 633.9,
        image:
          'http://challenge-api.luizalabs.com/images/5f1cb9b0-46c4-35a3-7b52-030c76dd8b08.jpg',
        brand: 'burigotto',
        id: '5f1cb9b0-46c4-35a3-7b52-030c76dd8b08',
        title: 'Cadeira para Auto Burigotto Matrix p/ Crianças',
      };

      cacheProviderMock.save(product.id, product);

      await createFavoriteProductsService.perform(customer.id, product.id);

      expect(httpRequestProviderSpy).not.toHaveBeenCalled();
    });
  });
});
