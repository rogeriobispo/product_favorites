import 'reflect-metadata';
import { container } from 'tsyringe';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '@server/app';
import { JwtConfig } from '@config/index';
import ClearCacheService from '../../services/ClearCacheService';
import CacheProviderMock from '../mocks/CacheProviderMock';

let clearCacheService: ClearCacheService;
let cacheProviderMock: CacheProviderMock;
let token: string;

describe('ClearCacheService', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');

    cacheProviderMock = new CacheProviderMock();

    clearCacheService = new ClearCacheService(cacheProviderMock);

    token = jwt.sign(
      {
        id: 'e1e46837-0f12-4207-9e7c-df7b5268a523',
        name: 'jhondoe',
        email: 'jhondoe@gmail.com',
      },
      JwtConfig.secret,
      {
        expiresIn: JwtConfig.expireIn,
      },
    );

    containerSpy.mockReturnValue(clearCacheService);
  });

  it('with a invalid token must be unautorized', async () => {
    token = 'invalid';

    const response = await request(app)
      .delete(`/api/cache`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(401);
  });

  it('should call invalidate product cache', async () => {
    const cacheProviderSpy = jest.spyOn(cacheProviderMock, 'clear');
    const response = await request(app)
      .delete(`/api/cache`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.statusCode).toEqual(200);
    expect(cacheProviderSpy).toHaveBeenCalledTimes(1);
  });
});
