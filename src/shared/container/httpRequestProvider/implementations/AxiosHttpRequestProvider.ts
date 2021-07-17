import axios from 'axios';
import IHttpRequestProvider from '../models/IHttpRequestProvider';

class AxiosHttpRequestProvider implements IHttpRequestProvider {
  async get<T>(url: string, path: string): Promise<T> {
    const api = axios.create({
      baseURL: url,
    });

    const response: T = await api.get(path);
    return response;
  }
}

export default AxiosHttpRequestProvider;
