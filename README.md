# Playwright E2E Framework

[![Playwright tests](https://github.com/waleedelkhonany/playwright-e2e-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/waleedelkhonany/playwright-e2e-framework/actions/workflows/playwright.yml)

End-to-end **UI and API** test framework built with **Playwright + TypeScript**. It shows the structure I use on real projects: Page Object Model, data-driven JSON scenarios, typed fixtures, an API client layer and CI on GitHub Actions.

The tests run against two public practice systems made for test automation:

| Layer | System under test | What is covered |
|---|---|---|
| UI | [Sauce Demo](https://www.saucedemo.com) | Login, products sorting, cart, checkout and validation |
| API | [Restful Booker](https://restful-booker.herokuapp.com) | Auth, full CRUD on bookings, authorization and error cases |

**30 tests · 24 UI · 6 API**

## Project structure

```
├── .github/workflows/playwright.yml   CI: typecheck + tests on every push, PR and weekly
├── playwright.config.ts               Two projects: "ui" (browser) and "api" (request only)
├── src/
│   ├── config/env.ts                  Base URLs and demo credentials (env or .env overrides)
│   ├── pages/                         Page objects: Login, Inventory, Cart, Checkout (+ BasePage)
│   ├── api/BookingClient.ts           Typed client for the Booking API
│   └── fixtures/test.ts               Custom fixtures: page objects, signed-in session, API client
└── tests/
    ├── auth/        login.spec.ts + login.data.json
    ├── inventory/   sorting.spec.ts
    ├── cart/        cart.spec.ts
    ├── checkout/    checkout.spec.ts + checkout.data.json
    └── api/         booking.spec.ts
```

## Design choices

- **Page Object Model.** Tests talk to pages through intent methods (`addToCart`, `fillCustomer`, `expectTotalsAreConsistent`), so a UI change is fixed in one place.
- **Data-driven scenarios.** Login and checkout cases live in JSON next to the spec. Adding a case means adding data, not code.
- **Stable locators.** `data-test` attributes through `getByTestId`, plus role-based locators for buttons. No CSS chains or XPath.
- **Fixtures instead of hooks.** `signedIn` gives a test a logged-in products page; `bookings` gives it the API client.
- **Business checks, not just clicks.** Checkout verifies that subtotal equals the sum of line prices and that total equals subtotal + tax.
- **Case codes.** Every test starts with a fixed code (`AUTH-010`, `CHK-002`, `API-003`) so results map to a test plan.
- **Debuggable failures.** Trace, screenshot and video are kept on failure; the HTML report is uploaded as a CI artifact.

## Test coverage

| Area | Cases |
|---|---|
| Login | Valid users, locked-out user, wrong password, unknown user, required fields, protected route when signed out, logout |
| Sorting | Name A–Z / Z–A, price low–high / high–low |
| Cart | Badge count, cart contents, remove from products page and cart page, persistence after reload |
| Checkout | Single and multi-item orders with totals check, required-field validation, cancel keeps the cart |
| API | Health check, create → read → update → delete, update/delete without token (403), bad credentials, unknown booking (404) |

## Run it

```bash
npm run setup          # install dependencies and Chromium
npm test               # all tests
npm run test:ui-only   # UI tests only
npm run test:api       # API tests only
npm run test:headed    # watch the browser
npm run report         # open the last HTML report
```

To point the suite at another environment, copy `.env.example` to `.env` and change the values.

## Tech

Playwright · TypeScript · Node.js · GitHub Actions

---

Waleed Elkhonany · Software QA Engineer · [LinkedIn](https://www.linkedin.com/in/waleed-elkhonany-5049a91b7/)
