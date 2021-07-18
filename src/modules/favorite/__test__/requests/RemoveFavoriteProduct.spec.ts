import 'reflect-metadata';
import { container } from 'tsyringe';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '@server/app';
import { JwtConfig } from '@config/index';
import CustomerRepositoryMock from '../mocks/CustomerRepositoryMock';
import RemoveFavoriteProductsService from '../../services/RemoveFavoriteProductsService';
import FavoriteProductsRepositoryMock from '../mocks/FavoriteProductsRepositoriesMock';
import Customer from '../../typeorm/entities/Customer';

let removeFavoriteProductsService: RemoveFavoriteProductsService;
let favoriteProductsRepositoryMock: FavoriteProductsRepositoryMock;
let customerRepositoryMock: CustomerRepositoryMock;
let customer: Customer;
let token: string;

describe('RemoveFavoriteProductsService', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');
    customerRepositoryMock = new CustomerRepositoryMock();
    favoriteProductsRepositoryMock = new FavoriteProductsRepositoryMock();
    removeFavoriteProductsService = new RemoveFavoriteProductsService(
      favoriteProductsRepositoryMock,
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

    containerSpy.mockReturnValue(removeFavoriteProductsService);
  });

  it('with a invalid token must be unautorized', async () => {
    const productId = '65050878-a949-1b0f-1b0a-df469d1e479a';
    token = 'invalid';

    const response = await request(app)
      .delete(`/api/products/${productId}/favorite`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(401);
  });

  it('should remove favorite products with the customer and the product is favorited', async () => {
    const favoriteRepoMockSpy = jest.spyOn(
      favoriteProductsRepositoryMock,
      'delete',
    );

    const productId = 'aae4fa86-ca9b-4b31-b6ad-4d655f0dfd07';

    const favorite = await favoriteProductsRepositoryMock.create(
      customer.id,
      productId,
    );

    const response = await request(app)
      .delete(`/api/products/${productId}/favorite`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(favoriteRepoMockSpy).toHaveBeenCalledTimes(1);
    expect(favoriteRepoMockSpy).toHaveBeenCalledWith(favorite);
  });

  it('should return 404 when the pair value customer/product does not exists', async () => {
    const productId = 'cce4fa86-ca9b-4b31-b6ad-4d655f0dfd07';

    const response = await request(app)
      .delete(`/api/products/${productId}/favorite`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(404);
  });
});
