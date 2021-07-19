import 'reflect-metadata';
import AppError from '@shared/errors/AppErrors';
import { injectable, inject } from 'tsyringe';
import IHttpRequestProvider from '@shared/container/httpRequestProvider/models/IHttpRequestProvider';
import ICacheProvider from '@shared/container/cacheProvider/models/ICacheProvider';
import { ProductsApiConfig } from '@shared/config';
import ICustomerRepository from '../interface/ICustomerRepository';
import IFavoriteProductsRespository from '../interface/IFavoriteProductsRespository';

interface ProductResponse {
  price: number;
  image: string;
  brand: string;
  id: string;
  title: string;
}

@injectable()
class CreateFavoriteProductsService {
  constructor(
    @inject('FavoriteRepository')
    private favoriteRepository: IFavoriteProductsRespository,
    @inject('HttpRequestProvider')
    private httpRequestProvider: IHttpRequestProvider,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
    @inject('FavoriteCustomerRepository')
    private customerRepository: ICustomerRepository,
  ) {}

  async perform(
    customerId: string,
    productId: string,
  ): Promise<ProductResponse> {
    const customer = await this.customerRepository.findById(customerId);

    if (!customer) throw new AppError('Customer not found', 422);

    const customerFavorites = await this.favoriteRepository.findByCustomerId(
      customerId,
    );

    if (customerFavorites.length >= customer.productFavoriteLimite)
      throw new AppError('Favorite limit reached', 422);
    let product: ProductResponse;

    try {
      product =
        (await this.cacheProvider.recover(productId)) ||
        (await this.httpRequestProvider.get<ProductResponse>(
          ProductsApiConfig.url,
          `${ProductsApiConfig.showProductsPath}${productId}/`.trim(),
        ));

      if (!product) throw new AppError('Product not found', 404);
    } catch (e) {
      throw new AppError(e, 404);
    }

    await this.cacheProvider.save<ProductResponse>(productId, product);

    const favoriteOnlist = await this.favoriteRepository.find(
      customerId,
      productId,
    );

    if (favoriteOnlist) throw new AppError('Already on favorite list');

    await this.favoriteRepository.create(customerId, productId);

    return product;
  }
}

export default CreateFavoriteProductsService;
