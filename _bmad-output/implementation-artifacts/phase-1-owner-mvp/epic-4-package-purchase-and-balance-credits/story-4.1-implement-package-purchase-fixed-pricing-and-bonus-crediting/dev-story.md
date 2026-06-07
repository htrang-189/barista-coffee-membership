# Development Objective

The objective of Story 4.1 was to convert the customer ledger from an identity-only record into a real prepaid package ledger. In the delivered application, this story implements the fixed-price package purchase workflow that updates customer balance, stores purchase revenue, and applies the shop’s exact bonus rules. This is the point where the membership product becomes financially real and operationally trustworthy.

## Files Created

### `models/cup-balance.js`

This file exists to centralize the package credit rules in one place.

Why it exists:

- Package pricing and bonus logic should not be scattered across routes, UI previews, and tests.
- The application needs a single source of truth for the 10/20/30 cup rules.

What problem it solves:

- It prevents logic drift between the admin UI, purchase recording, and test coverage.
- It avoids hard-coding package arithmetic directly in route handlers.

How it works:

- `calculatePackageCredits(...)` accepts a package size and returns the canonical package size, bonus cups, and total credited cups.
- It explicitly supports only `10`, `20`, and `30`.
- Invalid sizes throw a business-level error.

This file is the foundation of the fixed-package pricing model because the rest of the workflow depends on these rules being stable and reusable.

## Files Modified

### `models/package-purchase.js`

This file implements the package purchase transaction and amount calculation.

Why it exists:

- Package purchase is a business transaction, not just a UI event.
- The owner needs the purchase record, amount paid, bonus credit, and balance update to be written together.

What problem it solves:

- Without this file, the application would have no reliable ledger update for package purchases.

How it works:

- `CUP_PRICE_CENTS` defines the fixed per-cup price used by the application.
- `calculatePackageAmountPaidCents(...)` calculates the paid amount from the selected package size.
- `recordPackagePurchase(...)` starts a database transaction, inserts the purchase record, updates the customer balance, logs the admin action, and commits or rolls back as a unit.
- `listPackagePurchasesForCustomer(...)` retrieves the purchase history in newest-first order.

The transaction boundary is the most important implementation detail because it keeps the revenue record and customer balance aligned.

### `routes/admin.js`

This file was extended to expose the package purchase workflow through the owner portal.

Why it exists:

- The owner performs package purchases from the customer detail page, not through a separate payment screen.

What problem it solves:

- It provides the practical interface for the owner to record paid memberships directly against a customer account.

How it works:

- The customer detail page renders the purchase form with package-size selection only.
- The route posts the selected package size to the model layer.
- The page also renders purchase history so the owner can verify the record after save.
- The route keeps the customer balance and purchase history anchored to the same customer detail page.

### `public/js/admin.js`

This file implements the live package preview in the owner UI.

Why it exists:

- The owner should see the amount, bonus, and credited cups before saving the purchase.

What problem it solves:

- It eliminates manual arithmetic and helps prevent incorrect purchases from being recorded.

How it works:

- The script reads the selected package size.
- It updates the preview with the calculated amount, bonus note, and total credited cups.
- It supports the only approved package sizes: 10, 20, and 30.

### `tests/phase1-owner.test.js`

This file contains the primary package purchase regression coverage for the MVP.

Why it exists:

- Package purchase directly affects revenue and customer balance, so it needs automated protection.

What problem it solves:

- It proves that the fixed-price and bonus-credit logic remains correct.

How it works:

- The tests create isolated SQLite contexts.
- They call the package-purchase model directly.
- They verify the amount, bonus, total cups, and customer balance outcomes.
- They also verify invalid package-size rejection and UI preview expectations.

### `tests/customer-balance.test.js`

This file focuses on the package-credit helper itself.

Why it exists:

- The core bonus rule should be testable in isolation.

What problem it solves:

- It protects the pricing and credit calculation from regressions.

How it works:

- It asserts the 10/20/30 package mappings and the invalid-size failure path.

### `tests/e2e-owner-customer-flow.test.js`

This file extends the package-purchase behavior into a real owner workflow.

Why it exists:

- Package purchase is part of the owner’s actual operating flow, not just a unit-level calculation.

What problem it solves:

- It proves that package purchases can be recorded through the real admin session and then observed later in customer-facing or balance-linked behavior.

How it works:

- It authenticates as the owner.
- It creates a customer.
- It records package purchases through the application flow.
- It verifies the customer balance and purchase history outcomes.

## Database Changes

### `package_purchases` table usage

Story 4.1 relies on the package purchase table as the persistent ledger for revenue and credit activity.

Why it exists:

- The owner needs a permanent history of purchases, not a transient calculation.

What problem it solves:

- It allows later dashboard, history, and customer portal views to use the same source of truth.

How it works:

- The table stores package size, bonus cups, total cups added, amount paid, and the admin actor.

### `customer_accounts.current_balance`

This field is updated as part of the purchase transaction.

Why it exists:

- The customer’s current balance must always reflect the latest credited cups.

What problem it solves:

- It prevents the balance view from drifting away from the purchase ledger.

How it works:

- The model adds the total credited cups to `current_balance` in the same transaction as the purchase insert.

### `admin_action_logs`

The story also writes a purchase action log entry.

Why it exists:

- The application benefits from a lightweight record of owner operations.

What problem it solves:

- It supports auditability and operational traceability.

How it works:

- A log row is inserted when the package purchase is successfully recorded.

## Routes Added

### No new route namespace was added

The story uses the existing admin route namespace and customer detail workflow.

### Routes implemented or extended

- `POST /admin/customers/:customerId/package-purchases`
- `GET /admin/customers/:customerId`
- `GET /admin/customers/:customerId/package-purchases`

Why they exist:

- The owner needs to record a purchase from the customer detail page.
- The owner needs to see the resulting purchase history afterward.

How they work:

- The POST route sends the selected package size to `recordPackagePurchase(...)`.
- The detail page includes the purchase form and the live preview.
- The history route shows package purchases in newest-first order.

## Models Added

### `models/cup-balance.js`

This is the shared calculation model for package size to credits.

Key function:

- `calculatePackageCredits(...)`

Why it exists:

- The application needs one canonical place for the 10/20/30 cup rules.

What problem it solves:

- It prevents inconsistent bonus logic across UI, routes, and tests.

How it works:

- Returns the package size, bonus cups, and total cups added for each approved package.
- Throws on invalid package sizes.

### `models/package-purchase.js`

This is the transactional purchase model.

Key functions:

- `calculatePackageAmountPaidCents(...)`
- `recordPackagePurchase(...)`
- `listPackagePurchasesForCustomer(...)`

Why they exist:

- The story needs a ledger operation that records the purchase and updates the balance together.

What problem it solves:

- It prevents revenue and balance drift.

How it works:

- It calculates price from package size.
- It writes the purchase record.
- It increments the customer balance by the credited cups.
- It returns a ledger object that can be used in UI and tests.

## UI Components Added

### Package purchase form

Why it exists:

- The owner needs a simple way to choose a package size and save the purchase.

What problem it solves:

- It removes manual arithmetic from the owner workflow.

How it works:

- The form offers only the approved package sizes.
- It posts the selected size to the purchase route.

### Purchase preview box

Why it exists:

- The owner should see what the purchase will do before saving it.

What problem it solves:

- It reduces input mistakes and increases confidence in the ledger entry.

How it works:

- `public/js/admin.js` updates the preview when the selected package size changes.
- The preview shows purchased cups, calculated amount paid, bonus note, and total credited cups.

### Package purchase history section

Why it exists:

- The owner needs confirmation that the purchase was recorded correctly.

What problem it solves:

- It provides a quick verification path after save.

How it works:

- The customer detail page renders the purchase history newest first.

## Business Logic Implemented

### Fixed pricing

Why it exists:

- The shop sells prepaid cups at a fixed price per cup.

What problem it solves:

- It eliminates manual price entry and keeps revenue records consistent.

How it works:

- `calculatePackageAmountPaidCents(...)` multiplies the package size by the fixed cup price.

### Bonus credit rules

Why it exists:

- The membership program gives specific bonus credits for specific package sizes.

What problem it solves:

- It ensures the customer balance reflects the shop’s real sales policy.

How it works:

- `calculatePackageCredits(...)` maps 10, 20, and 30 to the 11, 22, and 33 cup totals.

### Transactional balance update

Why it exists:

- A purchase record is only useful if the balance update happens reliably with it.

What problem it solves:

- It avoids ledger mismatch.

How it works:

- The model starts a transaction, inserts the purchase, updates the balance, logs the action, and commits the transaction.
- Any failure rolls the transaction back.

## Validation Rules

The story enforces the following rules:

1. Package size must be 10, 20, or 30.
2. The amount paid is derived from package size only.
3. The preview must reflect the selected package size.
4. The customer must exist before a purchase can be recorded.
5. The purchase and balance update must be transactionally consistent.

Why they exist:

- They preserve the correctness of the membership ledger.

What problem they solve:

- They prevent invalid package entries and balance corruption.

How they work:

- Validation is handled through the shared helper and model logic, not by the UI alone.

## Security Controls

The story uses existing security controls rather than introducing new ones.

1. The purchase route is owner-only.
2. The customer detail page that hosts the purchase form is owner-only.
3. The amount is not free-typed, which reduces the chance of accidental or malicious ledger manipulation.
4. The database transaction prevents partial writes.

Why they exist:

- Package purchase is a ledger operation and must be protected.

What problem they solve:

- They keep the revenue and balance records trustworthy.

How it works:

- The admin route requires an authenticated owner session.
- The model uses transaction boundaries for all purchase writes.

## Test Coverage

The delivered implementation includes test coverage for:

1. 10 cup package credits 11 total cups
2. 20 cup package credits 22 total cups
3. 30 cup package credits 33 total cups
4. Invalid package size rejection
5. Customer balance updates after purchase
6. Transactional consistency for purchase writes
7. Preview rendering of amount, bonus, and total credited cups
8. Purchase history display

Why the tests exist:

- Package purchase is the financial core of the MVP.

What problem they solve:

- They protect the fixed pricing and bonus rule from regression.

How they work:

- Tests run against isolated SQLite databases.
- They verify both direct model behavior and UI preview behavior.
- They assert the exact package size, amount, bonus, and total credit outcomes.

This is the right test shape for the story because the critical risk is not visual styling; it is ledger correctness.
