# Playwright E2E Framework

[![Playwright Tests](https://github.com/osmanyrl87/playwright-e2e-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/osmanyrl87/playwright-e2e-framework/actions/workflows/playwright.yml)

End-to-end test framework built with **Playwright** and **TypeScript**, covering UI, API and accessibility testing in one suite, with CI on GitHub Actions.

| Layer | Application under test | What it covers |
| --- | --- | --- |
| UI | [SauceDemo](https://www.saucedemo.com) e-commerce store | Login, catalog sorting, cart, full checkout, form validation |
| API | [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html) REST API | Auth, full CRUD lifecycle, authorization rules, error handling |
| Accessibility | SauceDemo pages | WCAG 2.1 A/AA scan with axe-core |

Both applications are public practice targets built for test automation.

## Highlights

- **Page Object Model** with page objects injected as Playwright fixtures, so tests stay short and readable.
- **Log in once, reuse the session.** A setup project signs in and saves the browser state; UI tests start already authenticated.
- **Data-driven tests** for login and checkout validation rules.
- **API client layer** that keeps endpoints and auth handling out of the test bodies, with unique test data so parallel runs never collide.
- **Business-rule checks**, not just clicks: order subtotal, 8% tax and total are recalculated and compared with what the app shows.
- **Accessibility gate** that fails on critical WCAG violations and attaches the full axe report to every run.
- **CI on every push and nightly**, with HTML report, traces, screenshots and JUnit results kept as build artifacts.

## Project structure

```
├── api/
│   └── BookingClient.ts        # API client and test-data builder
├── fixtures/
│   └── test.ts                 # Extended test with page-object fixtures
├── pages/                      # Page objects
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/                  # Users, products, customer details
├── tests/
│   ├── auth.setup.ts           # Logs in once and saves the session
│   ├── ui/                     # Login, inventory, checkout, accessibility
│   └── api/                    # Restful-Booker booking tests
├── playwright.config.ts        # Projects: setup, ui-chromium, api
└── .github/workflows/          # CI pipeline
```

## Running the tests

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install chromium

npm test              # everything
npm run test:ui       # UI and accessibility tests
npm run test:api      # API tests only
npm run test:smoke    # tests tagged @smoke
npm run test:headed   # watch the UI tests run in a browser
npm run report        # open the last HTML report
```

Target environments can be changed without touching code:

```bash
UI_BASE_URL=https://staging.example.com API_BASE_URL=https://api.staging.example.com npm test
```

## Test coverage

**UI (SauceDemo)**
- Valid login, locked-out user, wrong password, missing username or password, redirect when signed out
- Catalog count and all four sort orders (name and price, both directions)
- Cart badge updates on add and remove; product detail price matches the catalog
- Full purchase of two items with subtotal, tax and total verification
- An item removed in the cart does not reach the order
- Required-field validation on checkout

**API (Restful-Booker)**
- Health check and token generation, including rejected credentials
- Create, read, filter, full update (PUT), partial update (PATCH) and delete of a booking
- Updates and deletes without a token are rejected with 403 and leave the data unchanged
- Unknown booking IDs return 404

**Accessibility**
- Login, inventory and cart pages scanned against WCAG 2.1 A/AA

## Author

**Osman Yarali**, Senior SDET · [LinkedIn](https://www.linkedin.com/in/osman-yarali-157724197)
