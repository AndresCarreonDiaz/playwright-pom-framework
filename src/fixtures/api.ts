import { test as base } from '@playwright/test';
import { ProductsApi } from '@api/ProductsApi';
import { AuthApi } from '@api/AuthApi';

export const test = base.extend<{ productsApi: ProductsApi; authApi: AuthApi }>({
  productsApi: async ({ request }, use) => use(new ProductsApi(request)),
  authApi: async ({ request }, use) => use(new AuthApi(request)),
});

export { expect } from '@playwright/test';
