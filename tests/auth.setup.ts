import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

const authFile = '.auth/standard_user.json';

/**
 * Logs in once and saves the session, so UI tests start already signed in
 * instead of repeating the login flow in every test.
 */
setup('authenticate as standard_user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.standard);
  await expect(page).toHaveURL(/inventory\.html/);
  await page.context().storageState({ path: authFile });
});
