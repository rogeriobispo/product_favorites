import { container } from 'tsyringe';

import IHashProvider from '@shared/container/hashProvider/models/IhashProvider';
import BCryptHashProvider from '@shared/container/hashProvider/implementations/BCryptHashProvider';
import RedisCacheProvider from '@shared/container/cacheProvider/implementations/RedisCacheProvider';
import ICacheProvider from '@shared/container/cacheProvider/models/ICacheProvider';

import IHttpRequestProvider from '@shared/container/httpRequestProvider/models/IHttpRequestProvider';
import AxiosHttpRequestProvider from './httpRequestProvider/implementations/AxiosHttpRequestProvider';

import '@modules/customer/providers';
import '@modules/auth/providers';
import '@modules/favorite/providers';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<IHttpRequestProvider>(
  'HttpRequestProvider',
  AxiosHttpRequestProvider,
);

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  RedisCacheProvider,
);
