import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly itemPrices: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.completeHeader = page.getByTestId('complete-header');
  }

  /** Fills only the fields that are given, then presses Continue. */
  async fillCustomer(c: Partial<Customer>): Promise<void> {
    if (c.firstName) await this.firstName.fill(c.firstName);
    if (c.lastName) await this.lastName.fill(c.lastName);
    if (c.postalCode) await this.postalCode.fill(c.postalCode);
    await this.continueButton.click();
  }

  private static money(text: string): number {
    return Number(text.replace(/[^0-9.]/g, ''));
  }

  /** Subtotal must equal the sum of the line prices, and total must equal subtotal + tax. */
  async expectTotalsAreConsistent(): Promise<void> {
    await this.expectTitle('Checkout: Overview');
    const lines = (await this.itemPrices.allInnerTexts()).map(CheckoutPage.money);
    const subtotal = CheckoutPage.money(await this.subtotal.innerText());
    const tax = CheckoutPage.money(await this.tax.innerText());
    const total = CheckoutPage.money(await this.total.innerText());
    const sum = lines.reduce((a, b) => a + b, 0);
    expect(subtotal, 'subtotal = sum of line prices').toBeCloseTo(sum, 2);
    expect(total, 'total = subtotal + tax').toBeCloseTo(subtotal + tax, 2);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
