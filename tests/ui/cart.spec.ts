import { test, expect } from '@fixtures/pages';
import { products } from '@data/products';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(products.backpack, products.fleeceJacket);
    await inventoryPage.header.openCart();
  });

  test('shows the items that were added', async ({ cartPage }) => {
    await cartPage.expectLoaded();
    await expect(cartPage.itemNames).toHaveText([products.backpack, products.fleeceJacket]);
  });

  test('removing an item updates the list and the badge', async ({ cartPage }) => {
    await cartPage.remove(products.backpack);

    await expect(cartPage.itemNames).toHaveText([products.fleeceJacket]);
    await expect(cartPage.header.cartBadge).toHaveText('1');
  });

  test('keeps its contents after a page reload', async ({ page, cartPage }) => {
    await page.reload();

    await expect(cartPage.items).toHaveCount(2);
  });
});
