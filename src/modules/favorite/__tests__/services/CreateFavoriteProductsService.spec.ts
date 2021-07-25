import AppError from '@shared/errors/AppErrors';
import connection from '../../../../database/testDB';
import CreateFavoriteProductsService from '../../services/CreateFavoriteProductsServices';
import FavoriteProductsRepository from '../../typeorm/repositories/FavoriteProductsRepository';
import CustomerRepositoryMock from '../../typeorm/repositories/CustomerRepository';
import HttpRequestProviderMock from '../mocks/HttpRequestProviderMock';
import CacheProviderMock from '../mocks/CacheProviderMock';

let createFavoriteProductsService: CreateFavoriteProductsService;
let favoriteProductsRepository: FavoriteProductsRepository;
let httpRequestProviderMock: HttpRequestProviderMock;
let cacheProviderMock: CacheProviderMock;
let customerRepositoryMock: CustomerRepositoryMock;

describe('CreateFavoriteProductsService', () => {
  beforeEach(async () => {
    favoriteProductsRepository = new FavoriteProductsRepository();
    httpRequestProviderMock = new HttpRequestProviderMock();
    cacheProviderMock = new CacheProviderMock();
    customerRepositoryMock = new CustomerRepositoryMock();
    createFavoriteProductsService = new CreateFavoriteProductsService(
      favoriteProductsRepository,
      httpRequestProviderMock,
      cacheProviderMock,
      customerRepositoryMock,
    );

    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('perform', () => {
    it('when the product exist and is not in the list should favorite', async () => {
      const repoSpy = jest.spyOn(favoriteProductsRepository, 'create');

      const customer = await customerRepositoryMock.create({
        name: 'jhonDoe',
        email: 'jhondoe@jhondoe.com.br',
        password: '123456',
        productFavoriteLimite: 10,
      });

      const customerId = customer.id;
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';

      const expectedResponse = {
        price: 149.9,
        image:
          'http://challenge-api.luizalabs.com/images/65050878-a949-1b0f-1b0a-df469d1e479a.jpg',
        brand: 'telltale games',
        id: '65050878-a949-1b0f-1b0a-df469d1e479a/',
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
        name: 'jhonDoe',
        email: 'jhondoe@jhondoe.com.br',
        password: '123456',
        productFavoriteLimite: 10,
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
      const customer = await customerRepositoryMock.create({
        name: 'jhonDoe',
        email: 'jhondoe@jhondoe.com.br',
        password: '123456',
        productFavoriteLimite: 10,
      });

      const productsID = [
        'ddeb989e-53c4-e68b-aa93-6e43afddb797',
        'de2911eb-ce5c-e783-1ca5-82d0ccd4e3d8',
        '1cc8ece1-895e-5d2a-de69-ad2d7884e722',
        '6c097dc3-0c93-65fe-d88b-3b53acbf1fd7',
        'f8cb4a82-910e-6654-1240-d994c2997d2c',
        '2bdaf48a-ce48-b798-9fbf-87c97f138a29',
        'e6862cb8-c978-3072-078b-5f690a0bc4d3',
        '5199e2a2-c947-7230-8269-9cdc7632ce9f',
        '12640bbd-fd5d-5db2-c63a-a84770287b29',
        '5f1cb9b0-46c4-35a3-7b52-030c76dd8b08',
      ];

      await favoriteProductsRepository.create(customer.id, productsID[0]);
      await favoriteProductsRepository.create(customer.id, productsID[1]);
      await favoriteProductsRepository.create(customer.id, productsID[2]);
      await favoriteProductsRepository.create(customer.id, productsID[3]);
      await favoriteProductsRepository.create(customer.id, productsID[4]);
      await favoriteProductsRepository.create(customer.id, productsID[5]);
      await favoriteProductsRepository.create(customer.id, productsID[6]);
      await favoriteProductsRepository.create(customer.id, productsID[7]);
      await favoriteProductsRepository.create(customer.id, productsID[8]);
      await favoriteProductsRepository.create(customer.id, productsID[9]);

      await expect(
        createFavoriteProductsService.perform(customer.id, productId),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('when the product is already on the list of favorite', async () => {
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';
      const customerId = 'a3fb22be-efbb-4375-adcf-1cc92953b88c';

      await favoriteProductsRepository.create(customerId, productId);

      await expect(
        createFavoriteProductsService.perform(customerId, productId),
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should save on cache products searched', async () => {
      const cacheSpy = jest.spyOn(cacheProviderMock, 'save');

      const customer = await customerRepositoryMock.create({
        name: 'jhonDoe',
        email: 'jhondoe@jhondoe.com.br',
        password: '123456',
        productFavoriteLimite: 10,
      });

      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';
      const customerId = customer.id;

      const product = {
        price: 149.9,
        image:
          'http://challenge-api.luizalabs.com/images/65050878-a949-1b0f-1b0a-df469d1e479a.jpg',
        brand: 'telltale games',
        id: '65050878-a949-1b0f-1b0a-df469d1e479a/',
        title: 'The Walking Dead - Season 2 para PS4',
      };

      await createFavoriteProductsService.perform(customerId, productId);

      expect(cacheSpy).toHaveBeenCalledTimes(1);
      expect(cacheSpy).toHaveBeenCalledWith(productId, product);
    });
    it('should get products on chached products', async () => {
      const httpRequestProviderSpy = jest.spyOn(httpRequestProviderMock, 'get');

      const customer = await customerRepositoryMock.create({
        name: 'jhonDoe',
        email: 'jhondoe@jhondoe.com.br',
        password: '123456',
        productFavoriteLimite: 10,
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
