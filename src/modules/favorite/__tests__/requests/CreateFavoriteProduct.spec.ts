import 'reflect-metadata';

import { container } from 'tsyringe';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '@server/app';
import { JwtConfig } from '@config/index';
import connection from '../../../../database/testDB';
import CreateFavoriteProductsService from '../../services/CreateFavoriteProductsServices';
import FavoriteProductsRepository from '../../typeorm/repositories/FavoriteProductsRepository';
import CustomerRepository from '../../typeorm/repositories/CustomerRepository';
import HttpRequestProviderMock from '../mocks/HttpRequestProviderMock';
import CacheProviderMock from '../mocks/CacheProviderMock';
import Customer from '../../typeorm/entities/Customer';

let createFavoriteProductsService: CreateFavoriteProductsService;
let favoriteProductsRepository: FavoriteProductsRepository;
let httpRequestProviderMock: HttpRequestProviderMock;
let cacheProviderMock: CacheProviderMock;
let customerRepository: CustomerRepository;

describe('CreateFavoriteProducts', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');

    favoriteProductsRepository = new FavoriteProductsRepository();
    httpRequestProviderMock = new HttpRequestProviderMock();
    cacheProviderMock = new CacheProviderMock();
    customerRepository = new CustomerRepository();
    createFavoriteProductsService = new CreateFavoriteProductsService(
      favoriteProductsRepository,
      httpRequestProviderMock,
      cacheProviderMock,
      customerRepository,
    );

    containerSpy.mockReturnValue(createFavoriteProductsService);
    await connection.clear();
  });

  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('perform', () => {
    it('with a invalid token must be unautorized', async () => {
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';
      const token = 'invalid';

      const response = await request(app)
        .post(`/api/products/${productId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(401);
    });

    it('when the product exist and is not in the list should favorite', async () => {
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';

      const customer = await customerRepository.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
        productFavoriteLimite: 10,
      });

      const token = await jwt.sign(
        { id: customer.id, name: customer.name, email: customer.email },
        JwtConfig.secret,
        {
          expiresIn: JwtConfig.expireIn,
        },
      );

      const expectedResponse = {
        price: 149.9,
        image:
          'http://challenge-api.luizalabs.com/images/65050878-a949-1b0f-1b0a-df469d1e479a.jpg',
        brand: 'telltale games',
        id: '65050878-a949-1b0f-1b0a-df469d1e479a/',
        title: 'The Walking Dead - Season 2 para PS4',
      };

      const response = await request(app)
        .post(`/api/products/${productId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expectedResponse);
    });

    it('when the product does not exist should return not found', async () => {
      const productId = 'deccc895-cbf1-4946-bf07-4c96048fa485';

      const customer = await customerRepository.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
        productFavoriteLimite: 10,
      });

      const token = await jwt.sign(
        { id: customer.id, name: customer.name, email: customer.email },
        JwtConfig.secret,
        {
          expiresIn: JwtConfig.expireIn,
        },
      );

      const response = await request(app)
        .post(`/api/products/${productId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
    });

    it('should not let add more than limit set to customer default 10', async () => {
      const productId = '5f1cb9b0-46c4-35a3-7b52-030c76dd8b08';

      const customer = await customerRepository.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
        productFavoriteLimite: 10,
      });

      const token = await jwt.sign(
        { id: customer.id, name: customer.name, email: customer.email },
        JwtConfig.secret,
        {
          expiresIn: JwtConfig.expireIn,
        },
      );

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

      const response = await request(app)
        .post(`/api/products/${productId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toEqual(422);
    });

    it('when the product is already on the list of favorite', async () => {
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';

      const customer = await customerRepository.create({
        name: 'JhonDoe',
        email: 'jhon@jhon.com.br',
        password: '123456',
        productFavoriteLimite: 10,
      });

      const token = await jwt.sign(
        { id: customer.id, name: customer.name, email: customer.email },
        JwtConfig.secret,
        {
          expiresIn: JwtConfig.expireIn,
        },
      );

      await favoriteProductsRepository.create(customer.id, productId);

      const response = await request(app)
        .post(`/api/products/${productId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toEqual(422);
    });
  });
});
