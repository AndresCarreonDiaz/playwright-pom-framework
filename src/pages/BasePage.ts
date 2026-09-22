import { type Locator, type Page, expect } from '@playwright/test';
import { HeaderComponent } from '@components/HeaderComponent';

/**
 * Shared behaviour for every page object: navigation, the page title
 * and the header that appears on every screen after login.
 */
export abstract class BasePage {
  readonly header: HeaderComponent;
  readonly title: Locator;

  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.title = page.getByTestId('title');
  }

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${this.path}$`));
  }
}
