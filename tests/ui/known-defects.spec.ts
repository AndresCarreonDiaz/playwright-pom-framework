import { test, expect } from '@fixtures/pages';
import { users } from '@data/users';

/**
 * SauceDemo ships deliberate bugs behind `problem_user`. These tests assert
 * the correct behaviour and are marked `test.fail()`: the suite stays green
 * while the bug exists, and turns red the day it is fixed, so the known-issue
 * list never goes stale.
 */
test.describe('Known defects (problem_user)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.loginAs(users.problem);
  });

  test('each product shows its own image', async ({ page, inventoryPage }) => {
    test.fail(true, 'problem_user renders the same image for every product');
    test.info().annotations.push({ type: 'issue', description: 'Product images all point to one file' });

    await expect(inventoryPage.items).toHaveCount(6);
    const sources = await page.locator('img.inventory_item_img').evaluateAll((imgs) =>
      imgs.map((img) => img.getAttribute('src')),
    );
    expect(new Set(sources).size).toBe(sources.length);
  });

  test('sorting by price reorders the list', async ({ inventoryPage }) => {
    test.fail(true, 'problem_user ignores the sort selection');
    test.info().annotations.push({ type: 'issue', description: 'Sort dropdown has no effect' });

    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
