import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { type Customer } from '@data/customers';

export class CheckoutInfoPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
  }

  async fill(customer: Partial<Customer>): Promise<void> {
    if (customer.firstName !== undefined) await this.firstNameInput.fill(customer.firstName);
    if (customer.lastName !== undefined) await this.lastNameInput.fill(customer.lastName);
    if (customer.postalCode !== undefined) await this.postalCodeInput.fill(customer.postalCode);
  }

  async submit(customer: Partial<Customer>): Promise<void> {
    await this.fill(customer);
    await this.continueButton.click();
  }
}
