import { test, expect } from '@fixtures/pages';
import { products } from '@data/products';
import { type SortOption } from '@pages/InventoryPage';

test.describe('Inventory', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('lists all six products', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  const nameSorts: { option: SortOption; label: string; compare: (a: string, b: string) => number }[] = [
    { option: 'az', label: 'name A to Z', compare: (a, b) => a.localeCompare(b) },
    { option: 'za', label: 'name Z to A', compare: (a, b) => b.localeCompare(a) },
  ];

  for (const { option, label, compare } of nameSorts) {
    test(`sorts by ${label}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      const names = await inventoryPage.names();
      expect(names).toEqual([...names].sort(compare));
    });
  }

  const priceSorts: { option: SortOption; label: string; compare: (a: number, b: number) => number }[] = [
    { option: 'lohi', label: 'price low to high', compare: (a, b) => a - b },
    { option: 'hilo', label: 'price high to low', compare: (a, b) => b - a },
  ];

  for (const { option, label, compare } of priceSorts) {
    test(`sorts by ${label}`, async ({ inventoryPage }) => {
      await inventoryPage.sortBy(option);

      const prices = await inventoryPage.prices();
      expect(prices).toEqual([...prices].sort(compare));
    });
  }

  test('cart badge tracks items added and removed', async ({ inventoryPage }) => {
    const { cartBadge } = inventoryPage.header;
    await expect(cartBadge).toBeHidden();

    await inventoryPage.addToCart(products.backpack, products.bikeLight);
    await expect(cartBadge).toHaveText('2');

    await inventoryPage.removeFromCart(products.backpack);
    await expect(cartBadge).toHaveText('1');
  });
});
