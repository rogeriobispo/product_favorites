import IHttpRequestProvider from '@shared/container/httpRequestProvider/models/IHttpRequestProvider';

interface IProduct {
  price: number;
  image: string;
  brand: string;
  id: string;
  title: string;
}

const arrayProducts: IProduct[] = [
  {
    price: 704.8,
    image:
      'http://challenge-api.luizalabs.com/images/ddeb989e-53c4-e68b-aa93-6e43afddb797.jpg',
    brand: 'burigotto',
    id: 'ddeb989e-53c4-e68b-aa93-6e43afddb797',
    title: 'Cadeira para Auto Burigotto Matrix p/ Crianças',
  },
  {
    price: 39.9,
    image:
      'http://challenge-api.luizalabs.com/images/de2911eb-ce5c-e783-1ca5-82d0ccd4e3d8.jpg',
    brand: 'elg',
    id: 'de2911eb-ce5c-e783-1ca5-82d0ccd4e3d8',
    title: 'Película Protetora para Samsung Galaxy S6',
  },
  {
    price: 556.9,
    image:
      'http://challenge-api.luizalabs.com/images/1cc8ece1-895e-5d2a-de69-ad2d7884e722.jpg',
    brand: 'pontto lavabo',
    id: '1cc8ece1-895e-5d2a-de69-ad2d7884e722',
    title: 'Assento Sanitário Cristal Translúcido Century',
  },
  {
    price: 499.99,
    image:
      'http://challenge-api.luizalabs.com/images/6c097dc3-0c93-65fe-d88b-3b53acbf1fd7.jpg',
    brand: 'lego',
    id: '6c097dc3-0c93-65fe-d88b-3b53acbf1fd7',
    title: 'LEGO Ninjago Ninja DBX',
  },
  {
    price: 667.8,
    image:
      'http://challenge-api.luizalabs.com/images/f8cb4a82-910e-6654-1240-d994c2997d2c.jpg',
    brand: 'burigotto',
    id: 'f8cb4a82-910e-6654-1240-d994c2997d2c',
    title: 'Cadeira para Auto Burigotto Matrix p/ Crianças',
  },
  {
    price: 149.9,
    image:
      'http://challenge-api.luizalabs.com/images/2bdaf48a-ce48-b798-9fbf-87c97f138a29.jpg',
    brand: 'telltale games',
    id: '2bdaf48a-ce48-b798-9fbf-87c97f138a29',
    title: 'The Walking Dead - Season 2 para Xbox One',
  },
  {
    price: 624.8,
    image:
      'http://challenge-api.luizalabs.com/images/e6862cb8-c978-3072-078b-5f690a0bc4d3.jpg',
    brand: 'burigotto',
    id: 'e6862cb8-c978-3072-078b-5f690a0bc4d3',
    title: 'Cadeira para Auto Burigotto Matrix p/ Crianças',
  },
  {
    price: 149.9,
    image:
      'http://challenge-api.luizalabs.com/images/65050878-a949-1b0f-1b0a-df469d1e479a.jpg',
    brand: 'telltale games',
    id: '65050878-a949-1b0f-1b0a-df469d1e479a/',
    title: 'The Walking Dead - Season 2 para PS4',
  },
  {
    price: 556.9,
    image:
      'http://challenge-api.luizalabs.com/images/12640bbd-fd5d-5db2-c63a-a84770287b29.jpg',
    brand: 'pontto lavabo',
    id: '12640bbd-fd5d-5db2-c63a-a84770287b29',
    title: 'Assento Sanitário Conhaque Translúcido Century',
  },
  {
    price: 129.9,
    image:
      'http://challenge-api.luizalabs.com/images/a96b5916-9109-5d2e-138a-7b656efe1f92.jpg',
    brand: 'telltale games',
    id: 'a96b5916-9109-5d2e-138a-7b656efe1f92',
    title: 'The Walking Dead - Season 2 para PS3',
  },
  {
    price: 633.9,
    image:
      'http://challenge-api.luizalabs.com/images/5f1cb9b0-46c4-35a3-7b52-030c76dd8b08.jpg',
    brand: 'burigotto',
    id: '5f1cb9b0-46c4-35a3-7b52-030c76dd8b08',
    title: 'Cadeira para Auto Burigotto Matrix p/ Crianças',
  },
  {
    price: 129.9,
    image:
      'http://challenge-api.luizalabs.com/images/24e9757f-1a24-6efa-465d-556cd318df98.jpg',
    brand: 'telltale games',
    id: '24e9757f-1a24-6efa-465d-556cd318df98',
    title: 'The Walking Dead - Season 2 para Xbox 360',
  },
  {
    price: 668.8,
    image:
      'http://challenge-api.luizalabs.com/images/5199e2a2-c947-7230-8269-9cdc7632ce9f.jpg',
    brand: 'burigotto',
    id: '5199e2a2-c947-7230-8269-9cdc7632ce9f',
    title: 'Cadeira para Auto Burigotto Matrix p/ Crianças',
  },
];

class HttpRequestProviderMock implements IHttpRequestProvider {
  async get<T>(url: string, path: string): Promise<any> {
    const response = arrayProducts.filter(product => product.id === path)[0];
    return response;
  }
}

export default HttpRequestProviderMock;
export { IProduct };
