import { Locator, Page, expect } from '@playwright/test';

/** Elements shared by every signed-in page: the page title and the cart. */
export abstract class BasePage {
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(protected readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async expectTitle(text: string): Promise<void> {
    await expect(this.title).toHaveText(text);
  }

  async expectCartCount(count: number): Promise<void> {
    if (count === 0) await expect(this.cartBadge).toBeHidden();
    else await expect(this.cartBadge).toHaveText(String(count));
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
