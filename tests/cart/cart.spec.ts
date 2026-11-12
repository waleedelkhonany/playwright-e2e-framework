import { test, expect } from '../../src/fixtures/test';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';
const ONESIE = 'Sauce Labs Onesie';

test.describe('Cart', () => {
  test('CART-001 adding products updates the cart badge', async ({ signedIn }) => {
    await signedIn.expectCartCount(0);
    await signedIn.addToCart(BACKPACK);
    await signedIn.expectCartCount(1);
    await signedIn.addToCart(BIKE_LIGHT);
    await signedIn.expectCartCount(2);
  });

  test('CART-002 cart lists exactly the products that were added', async ({ signedIn, cartPage }) => {
    await signedIn.addToCart(BACKPACK);
    await signedIn.addToCart(ONESIE);
    await signedIn.openCart();
    await cartPage.expectItems([BACKPACK, ONESIE]);
  });

  test('CART-003 removing from the products page clears the badge', async ({ signedIn }) => {
    await signedIn.addToCart(BACKPACK);
    await signedIn.removeFromCart(BACKPACK);
    await signedIn.expectCartCount(0);
  });

  test('CART-004 removing from the cart page keeps the other items', async ({ signedIn, cartPage }) => {
    await signedIn.addToCart(BACKPACK);
    await signedIn.addToCart(BIKE_LIGHT);
    await signedIn.openCart();
    await cartPage.remove(BACKPACK);
    await cartPage.expectItems([BIKE_LIGHT]);
    await cartPage.expectCartCount(1);
  });

  test('CART-005 cart survives a page reload', async ({ signedIn, page }) => {
    await signedIn.addToCart(BACKPACK);
    await page.reload();
    await signedIn.expectCartCount(1);
    await expect(page.getByTestId('remove-sauce-labs-backpack')).toBeVisible();
  });
});
