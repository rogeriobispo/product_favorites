import axios from 'axios';
import IHttpRequestProvider from '../models/IHttpRequestProvider';

class AxiosHttpRequestProvider implements IHttpRequestProvider {
  async get<T>(url: string, path: string): Promise<T> {
    const api = await axios.create({
      baseURL: url,
      timeout: 1000,
    });

    const response = await api.get(path);
    return response.data as T;
  }
}

export default AxiosHttpRequestProvider;
