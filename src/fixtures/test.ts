import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { BookingClient } from '../api/BookingClient';
import { env } from '../config/env';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** Signs in as standard_user and starts on the products page. */
  signedIn: InventoryPage;
  bookings: BookingClient;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  signedIn: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.open();
    await loginPage.login('standard_user', env.uiPassword);
    await inventoryPage.expectLoaded();
    await use(inventoryPage);
  },
  bookings: async ({ request }, use) => use(new BookingClient(request)),
});

export { expect };
