import { test, expect } from '../../src/fixtures/test';
import data from './checkout.data.json';

test.describe('Checkout', () => {
  for (const c of data.orders) {
    test(`${c.id} ${c.name}`, async ({ signedIn, cartPage, checkoutPage, page }) => {
      for (const p of c.products) await signedIn.addToCart(p);
      await signedIn.openCart();
      await cartPage.expectItems(c.products);
      await cartPage.checkout();

      await checkoutPage.fillCustomer(c.customer);
      await checkoutPage.expectTotalsAreConsistent();
      await checkoutPage.finish();

      await expect(page).toHaveURL(/checkout-complete\.html/);
      await checkoutPage.expectCartCount(0);
    });
  }

  for (const c of data.validation) {
    test(`${c.id} ${c.name}`, async ({ signedIn, cartPage, checkoutPage, page }) => {
      await signedIn.addToCart('Sauce Labs Backpack');
      await signedIn.openCart();
      await cartPage.checkout();

      await checkoutPage.fillCustomer(c.customer);
      await expect(checkoutPage.error).toContainText(c.error);
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  }

  test('CHK-020 cancel on the overview returns to products and keeps the cart', async ({ signedIn, cartPage, checkoutPage, page }) => {
    await signedIn.addToCart('Sauce Labs Backpack');
    await signedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillCustomer({ firstName: 'Sara', lastName: 'Ahmed', postalCode: '11511' });
    await page.getByTestId('cancel').click();
    await signedIn.expectLoaded();
    await signedIn.expectCartCount(1);
  });
});
