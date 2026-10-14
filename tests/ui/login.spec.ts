import { test, expect } from '../../fixtures/test';
import { users } from '../../test-data/users';

// Login tests need a signed-out browser, so they drop the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can sign in @smoke', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('locked-out user sees a clear error', async ({ page, loginPage }) => {
    await loginPage.login(users.lockedOut);
    await loginPage.expectError('Sorry, this user has been locked out.');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login({ username: users.standard.username, password: 'wrong_password' });
    await loginPage.expectError('Username and password do not match any user in this service');
  });

  const missingFields = [
    { case: 'empty username', user: { username: '', password: 'secret_sauce' }, error: 'Username is required' },
    { case: 'empty password', user: { username: 'standard_user', password: '' }, error: 'Password is required' },
  ];

  for (const { case: name, user, error } of missingFields) {
    test(`validation: ${name}`, async ({ loginPage }) => {
      await loginPage.login(user);
      await loginPage.expectError(error);
    });
  }

  test('protected pages redirect to login when signed out', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });
});
