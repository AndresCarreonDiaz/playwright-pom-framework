import { type APIRequestContext, type APIResponse } from '@playwright/test';

/**
 * Service object for the products endpoints: the API-side equivalent of a
 * page object. Tests call intent-level methods and never build URLs.
 */
export class ProductsApi {
  constructor(private readonly request: APIRequestContext) {}

  list(params: { limit?: number; skip?: number } = {}): Promise<APIResponse> {
    return this.request.get('/products', { params });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/products/${id}`);
  }

  search(query: string): Promise<APIResponse> {
    return this.request.get('/products/search', { params: { q: query } });
  }

  add(product: { title: string; price: number }): Promise<APIResponse> {
    return this.request.post('/products/add', { data: product });
  }
}
