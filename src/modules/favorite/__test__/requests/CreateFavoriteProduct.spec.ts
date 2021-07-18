import 'reflect-metadata';
import { container } from 'tsyringe';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '@server/app';
import { JwtConfig } from '@config/index';
import CreateFavoriteProductsService from '../../services/CreateFavoriteProductsServices';
import FavoriteProductsRepositoryMock from '../mocks/FavoriteProductsRepositoriesMock';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import HttpRequestProviderMock from '../mocks/HttpRequestProviderMock';
import CacheProviderMock from '../mocks/CacheProviderMock';
import Customer from '../../typeorm/entities/Customer';

let createFavoriteProductsService: CreateFavoriteProductsService;
let favoriteProductsRepositoryMock: FavoriteProductsRepositoryMock;
let httpRequestProviderMock: HttpRequestProviderMock;
let cacheProviderMock: CacheProviderMock;
let customerRepositoryMock: CustomerRepositoryMock;
let customer: Customer;
let token: string;

describe('CreateFavoriteProducts', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');

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

    customer = await customerRepositoryMock.create({
      name: 'JhonDoe',
      email: 'jhon@jhon.com.br',
      password: '123456',
    });

    token = jwt.sign(
      { id: customer.id, name: 'jhondoe', email: 'jhondoe@gmail.com' },
      JwtConfig.secret,
      {
        expiresIn: JwtConfig.expireIn,
      },
    );

    containerSpy.mockReturnValue(createFavoriteProductsService);
  });

  describe('perform', () => {
    it('with a invalid token must be unautorized', async () => {
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';
      token = 'invalid';

      const response = await request(app)
        .post(`/api/products/${productId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(401);
    });

    it('when the product exist and is not in the list should favorite', async () => {
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';

      const expectedResponse = {
        price: 149.9,
        image:
          'http://challenge-api.luizalabs.com/images/65050878-a949-1b0f-1b0a-df469d1e479a.jpg',
        brand: 'telltale games',
        id: '65050878-a949-1b0f-1b0a-df469d1e479a',
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

      const response = await request(app)
        .post(`/api/products/${productId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.status).toBe(404);
    });

    it('should not let add more than limit set to customer default 10', async () => {
      const productId = '5f1cb9b0-46c4-35a3-7b52-030c76dd8b08';
      const customerId = 'a3fb22be-efbb-4375-adcf-1cc92953b88c';

      token = jwt.sign(
        { id: customerId, name: 'jhondoe', email: 'jhondoe@gmail.com' },
        JwtConfig.secret,
        {
          expiresIn: JwtConfig.expireIn,
        },
      );
      const response = await request(app)
        .post(`/api/products/${productId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toEqual(422);
    });

    it('when the product is already on the list of favorite', async () => {
      const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';
      const customerId = 'a3fb22be-efbb-4375-adcf-1cc92953b88c';

      await favoriteProductsRepositoryMock.create(customerId, productId);

      token = jwt.sign(
        { id: customerId, name: 'jhondoe', email: 'jhondoe@gmail.com' },
        JwtConfig.secret,
        {
          expiresIn: JwtConfig.expireIn,
        },
      );
      const response = await request(app)
        .post(`/api/products/${productId}/favorite`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

      expect(response.statusCode).toEqual(422);
    });
  });
});
