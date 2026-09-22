import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice } from './InventoryPage';

export interface OrderSummary {
  itemPrices: number[];
  subtotal: number;
  tax: number;
  total: number;
}

export class CheckoutOverviewPage extends BasePage {
  protected readonly path = '/checkout-step-two.html';

  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
  }

  async summary(): Promise<OrderSummary> {
    const [prices, subtotal, tax, total] = await Promise.all([
      this.itemPrices.allTextContents(),
      this.subtotalLabel.textContent(),
      this.taxLabel.textContent(),
      this.totalLabel.textContent(),
    ]);
    return {
      itemPrices: prices.map(parsePrice),
      subtotal: parsePrice(subtotal ?? ''),
      tax: parsePrice(tax ?? ''),
      total: parsePrice(total ?? ''),
    };
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
