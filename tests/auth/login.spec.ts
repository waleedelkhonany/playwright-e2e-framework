import { test, expect } from '../../src/fixtures/test';
import { env } from '../../src/config/env';
import data from './login.data.json';

/** "$PASSWORD" in the data file means the real demo password from env. */
const resolve = (value: string) => (value === '$PASSWORD' ? env.uiPassword : value);

test.describe('Login', () => {
  for (const c of data.valid) {
    test(`${c.id} ${c.name}`, async ({ loginPage, inventoryPage }) => {
      await loginPage.open();
      await loginPage.login(c.username, env.uiPassword);
      await inventoryPage.expectLoaded();
      await expect(inventoryPage.items).toHaveCount(6);
    });
  }

  for (const c of data.invalid) {
    test(`${c.id} ${c.name}`, async ({ loginPage, page }) => {
      await loginPage.open();
      await loginPage.login(c.username, resolve(c.password));
      await loginPage.expectError(c.error);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }

  test('AUTH-020 products page is protected when signed out', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError("You can only access '/inventory.html' when you are logged in.");
  });

  test('AUTH-021 user can log out from the menu', async ({ signedIn, page, loginPage }) => {
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByTestId('logout-sidebar-link').click();
    await expect(loginPage.loginButton).toBeVisible();
    await page.goto('/inventory.html');
    await expect(loginPage.error).toBeVisible();
  });
});
