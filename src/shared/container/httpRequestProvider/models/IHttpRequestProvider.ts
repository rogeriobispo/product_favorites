interface IHttpRequestProvider {
  get<T>(url: string, path: string): Promise<T>;
}

export default IHttpRequestProvider;
