# Playwright POM Framework

[![tests](https://github.com/AndresCarreonDiaz/playwright-pom-framework/actions/workflows/tests.yml/badge.svg)](https://github.com/AndresCarreonDiaz/playwright-pom-framework/actions/workflows/tests.yml)
[![report](https://img.shields.io/badge/report-latest%20run-2ea44f)](https://andrescarreondiaz.github.io/playwright-pom-framework/)

A test automation framework built with **Playwright and TypeScript** using the **Page Object Model**. It covers a web store end to end (UI) and a REST API (API), and runs on four browser targets in GitHub Actions on every push and once a day.

The apps under test are public practice targets: [SauceDemo](https://www.saucedemo.com) for the UI and [DummyJSON](https://dummyjson.com) for the API. This repo is a demo of how I structure automation. My professional test code lives in private company repositories.

## What it demonstrates

- **Page Object Model.** Every selector lives in a page object. Specs only describe user behaviour, so a UI change is fixed in one file.
- **Reusable components.** The header (cart, menu, logout) is a component shared by every page through `BasePage`.
- **Fixtures for dependency injection.** Tests ask for `inventoryPage` or `productsApi` instead of building objects by hand.
- **Log in once.** A setup project logs in through the UI and saves the session. UI tests then start on the page they actually test.
- **Data-driven tests.** Login errors, checkout validation and sorting are driven from tables of cases.
- **Business-rule assertions.** The checkout test checks the maths (item total, 8% tax, grand total), not just that a page loaded.
- **Known-defect tracking.** `problem_user` has deliberate bugs. Those tests assert the correct behaviour and are marked `test.fail()`, so they turn red the day the bug is fixed and the known-issue list never goes stale.
- **API testing with schema validation.** Service objects (the API version of page objects) plus [Zod](https://zod.dev) schemas. They cover pagination, 404s, search relevance, creates, token auth and rejected tokens.
- **Stable selectors.** `data-test` attributes and roles only. No CSS chains, no XPath, no hard waits.
- **CI pipeline.** Lint and type-check first, then a parallel matrix per browser, then one merged HTML report published to GitHub Pages. Traces, screenshots and videos are kept for failed tests.

## Structure

```
src/
  pages/            Page objects (BasePage, Login, Inventory, Cart, Checkout x3)
  components/       Shared UI components (HeaderComponent)
  api/              API service objects and Zod response schemas
  fixtures/         Playwright fixtures that inject page objects and API clients
  data/             Test users, products, customers
tests/
  setup/            Logs in once and saves the session (storageState)
  ui/               Login, inventory, cart, checkout, known defects
  api/              Products and auth endpoints
.github/workflows/  CI: static checks, browser matrix, merged report, Pages deploy
```

## Example

```ts
test('completes a purchase with correct totals', async ({
  inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage,
}) => {
  await inventoryPage.addToCart(products.backpack, products.boltTShirt);
  await inventoryPage.header.openCart();
  await cartPage.checkout();
  await checkoutInfoPage.submit(defaultCustomer);

  const summary = await checkoutOverviewPage.summary();
  expect(summary.total).toBeCloseTo(summary.subtotal + summary.tax, 2);

  await checkoutOverviewPage.finish();
  await expect(checkoutCompletePage.confirmationHeader).toHaveText('Thank you for your order!');
});
```

## Running it

Requires Node 22+.

```bash
npm ci
npx playwright install

npm test                 # everything: 4 browser targets + API
npm run test:smoke       # only tests tagged @smoke
npm run test:api         # API suite only
npx playwright test --project=chromium --headed   # watch it run
npm run report           # open the last HTML report
npm run lint && npm run typecheck
```

Point the suites at another environment with `BASE_URL` and `API_URL` (see `.env.example`).

## Browser targets

| Project | Device |
|---|---|
| `chromium` | Desktop Chrome |
| `firefox` | Desktop Firefox |
| `webkit` | Desktop Safari |
| `mobile-chrome` | Pixel 7 viewport and user agent |
| `api` | No browser, HTTP only |

## Design decisions

- **Why page objects expose locators and not just methods.** Assertions stay in the specs, where the reader expects them, and they get Playwright's auto-retrying `expect`. Page objects own *how to find and do*; specs own *what should be true*.
- **Why a setup project instead of logging in in `beforeEach`.** It is faster, and a login bug fails one clearly named test instead of every test in the suite.
- **Why retries only on CI.** Locally a flaky test should fail loudly. On CI, `retries: 2` with `trace: 'on-first-retry'` means a flaky test is reported as flaky, with a full trace to debug it.
- **Why a daily scheduled run.** The apps under test are outside my control. A nightly run catches changes on their side before they are mistaken for regressions in a pull request.

## Related

- [appium-pom-framework](https://github.com/AndresCarreonDiaz/appium-pom-framework): the same Page Object approach for native iOS and Android apps with Appium.
