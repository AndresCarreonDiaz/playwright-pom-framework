import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { users } from '@data/users';

const AUTH_FILE = '.auth/standard-user.json';

// Log in through the UI once and reuse the session in every UI test,
// so specs start on the page they test instead of repeating the login.
setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAs(users.standard);
  await expect(page).toHaveURL(/inventory\.html$/);
  await page.context().storageState({ path: AUTH_FILE });
});
