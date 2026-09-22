import { test, expect } from '@fixtures/pages';
import { users } from '@data/users';

// These tests exercise the login itself, so they start logged out.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user lands on the inventory', { tag: '@smoke' }, async ({ loginPage, inventoryPage }) => {
    await loginPage.loginAs(users.standard);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user sees an explanation', async ({ loginPage }) => {
    await loginPage.loginAs(users.lockedOut);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
  });

  const invalidAttempts = [
    { case: 'wrong password', username: 'standard_user', password: 'wrong', error: 'Username and password do not match any user in this service' },
    { case: 'missing username', username: '', password: 'secret_sauce', error: 'Username is required' },
    { case: 'missing password', username: 'standard_user', password: '', error: 'Password is required' },
  ];

  for (const attempt of invalidAttempts) {
    test(`rejects login with ${attempt.case}`, async ({ loginPage }) => {
      await loginPage.login(attempt.username, attempt.password);

      await expect(loginPage.errorMessage).toContainText(attempt.error);
      await expect(loginPage.usernameInput).toHaveClass(/error/);
    });
  }

  test('logging out blocks direct access to the inventory', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.loginAs(users.standard);
    await inventoryPage.header.logout();

    await expect(loginPage.loginButton).toBeVisible();
    await page.goto('/inventory.html');
    await expect(loginPage.errorMessage).toContainText(
      "You can only access '/inventory.html' when you are logged in.",
    );
  });
});
