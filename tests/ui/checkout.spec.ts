import { test, expect } from '@fixtures/pages';
import { products } from '@data/products';
import { defaultCustomer } from '@data/customers';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('completes a purchase with correct totals', { tag: '@smoke' }, async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    await inventoryPage.addToCart(products.backpack, products.boltTShirt);
    await inventoryPage.header.openCart();
    await cartPage.checkout();
    await checkoutInfoPage.submit(defaultCustomer);

    await test.step('order summary adds up', async () => {
      const summary = await checkoutOverviewPage.summary();
      const itemTotal = summary.itemPrices.reduce((sum, price) => sum + price, 0);

      expect(summary.subtotal).toBeCloseTo(itemTotal, 2);
      expect(summary.total).toBeCloseTo(summary.subtotal + summary.tax, 2);
      // SauceDemo charges 8% tax, rounded to the cent.
      expect(summary.tax).toBeCloseTo(Math.round(itemTotal * 8) / 100, 2);
    });

    await checkoutOverviewPage.finish();
    await expect(checkoutCompletePage.confirmationHeader).toHaveText('Thank you for your order!');
    await expect(checkoutCompletePage.header.cartBadge).toBeHidden();
  });

  const missingFields = [
    { field: 'first name', customer: { ...defaultCustomer, firstName: '' }, error: 'First Name is required' },
    { field: 'last name', customer: { ...defaultCustomer, lastName: '' }, error: 'Last Name is required' },
    { field: 'postal code', customer: { ...defaultCustomer, postalCode: '' }, error: 'Postal Code is required' },
  ];

  for (const { field, customer, error } of missingFields) {
    test(`requires a ${field}`, async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
      await inventoryPage.addToCart(products.onesie);
      await inventoryPage.header.openCart();
      await cartPage.checkout();
      await checkoutInfoPage.submit(customer);

      await expect(checkoutInfoPage.errorMessage).toContainText(error);
      await checkoutInfoPage.expectLoaded();
    });
  }
});
