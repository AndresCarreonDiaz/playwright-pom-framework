import { test, expect } from '@fixtures/api';
import { errorSchema, productListSchema, productSchema } from '@api/schemas';

test.describe('Products API', () => {
  test('lists products with pagination', { tag: '@smoke' }, async ({ productsApi }) => {
    const response = await productsApi.list({ limit: 5, skip: 10 });

    expect(response.status()).toBe(200);
    const body = productListSchema.parse(await response.json());
    expect(body.products).toHaveLength(5);
    expect(body.skip).toBe(10);
    expect(body.products[0].id).toBe(11);
  });

  test('pages do not overlap', async ({ productsApi }) => {
    const first = productListSchema.parse(await (await productsApi.list({ limit: 10, skip: 0 })).json());
    const second = productListSchema.parse(await (await productsApi.list({ limit: 10, skip: 10 })).json());

    const firstIds = new Set(first.products.map((p) => p.id));
    expect(second.products.some((p) => firstIds.has(p.id))).toBe(false);
  });

  test('returns a single product matching the schema', async ({ productsApi }) => {
    const response = await productsApi.get(1);

    expect(response.status()).toBe(200);
    const product = productSchema.parse(await response.json());
    expect(product.id).toBe(1);
  });

  test('returns 404 with a message for an unknown product', async ({ productsApi }) => {
    const response = await productsApi.get(999_999);

    expect(response.status()).toBe(404);
    const body = errorSchema.parse(await response.json());
    expect(body.message).toContain('not found');
  });

  test('search results all match the query', async ({ productsApi }) => {
    const query = 'phone';
    const body = productListSchema.parse(await (await productsApi.search(query)).json());

    expect(body.products.length).toBeGreaterThan(0);
    for (const product of body.products) {
      expect(`${product.title} ${product.description}`.toLowerCase()).toContain(query);
    }
  });

  test('creating a product echoes it back with an id', async ({ productsApi }) => {
    const newProduct = { title: 'Hardware wallet', price: 79 };
    const response = await productsApi.add(newProduct);

    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject({ ...newProduct, id: expect.any(Number) });
  });
});
