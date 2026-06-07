# BMAD Dev Story: Story 1.5 - Implement Package Credit Calculation

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Story: Story 1.5 - Implement Package Credit Calculation

Output type: CODE

Status: Implemented / Delivered

## 1. Development Objective

The development objective of Story 1.5 was to implement the package credit calculation rule that determines how many cups are added to a customer account when the owner records a package purchase. This rule is central to the product because the application is a prepaid coffee cup ledger. If the package credit rule is wrong, the owner may over-credit or under-credit a customer, the customer balance will become unreliable, and the shop will lose confidence in using the system instead of a paper ledger or spreadsheet.

This story delivered a reusable server-side calculation function for the approved package sizes. The current implemented rule is:

- 10 purchased cups credits 11 total cups.
- 20 purchased cups credits 22 total cups.
- 30 purchased cups credits 33 total cups.

The calculation was implemented as foundational business logic rather than as a one-off route calculation. That decision matters because the same rule is later used by purchase recording, balance updates, dashboard metrics, package history, and customer-facing balance views. Keeping the rule centralized reduces the risk that one part of the application displays one value while another part stores a different value.

## 2. Implementation Summary

The delivered implementation adds a focused model module, `models/cup-balance.js`, that exposes `calculatePackageCredits(packageSize)`. This function accepts a package size, normalizes it to a number, validates that it is one of the supported package sizes, and returns a structured object containing the purchased package size, bonus cup count, and total credited cups.

The implementation is intentionally small and deterministic. It does not read from the database, write to the database, depend on Express request objects, depend on session state, or depend on browser-side JavaScript. This makes the function easy to test and safe to reuse.

The function is consumed by `models/package-purchase.js`, where package purchases are recorded. When the owner records a purchase, the package purchase model calls `calculatePackageCredits`, stores the calculated values in the `package_purchases` table, and updates `customer_accounts.current_balance` by the calculated `totalCupsAdded`.

This means the package credit rule is not only present as a standalone helper. It is actively connected to the delivered owner workflow that credits customer balances.

## 3. Files Created

### `models/cup-balance.js`

This file was created to hold the package credit business rule.

Why it exists:

The application needs a single authoritative place for calculating credited cups. Without a dedicated model file, package credit logic could be duplicated in route handlers, UI preview code, tests, or database scripts. Duplicated business rules would increase the chance of drift, especially because the package rules changed during the project from `30 -> 30` to `30 -> 33`.

What problem it solves:

It prevents the owner workflow from relying on manual bonus calculation. It also ensures that later features can calculate package credits by importing one function rather than reimplementing the same conditions.

How it works:

The file defines `calculatePackageCredits(packageSize)`. The function converts the input using `Number(packageSize)` and then checks the normalized value against the supported package sizes. For each supported size, it returns a complete credit object:

- `packageSize`
- `bonusCups`
- `totalCupsAdded`

For unsupported package sizes, the function throws an explicit error:

```text
Invalid package size. Package size must be 10, 20, or 30.
```

The function is exported with CommonJS so it can be imported by model code and tests:

```js
module.exports = {
  calculatePackageCredits
};
```

## 4. Files Modified

### `models/package-purchase.js`

This file uses the package credit calculation during the delivered package purchase workflow.

Why it exists in this story's implementation evidence:

Although the package purchase workflow is delivered under a later business capability, the completed application uses Story 1.5's calculation function from this model. This file demonstrates that the foundational calculation is not isolated documentation; it is wired into the real purchase flow.

What problem it solves:

It ensures package purchases are recorded with calculated bonus cups and calculated total credited cups. The owner does not enter those values manually, and customer balances are updated from the same business rule that the tests validate.

How it works:

`models/package-purchase.js` imports the calculation function:

```js
const { calculatePackageCredits } = require('./cup-balance');
```

When `recordPackagePurchase(database, customerId, packageSize, adminUserId)` runs, it calls:

```js
const packageCredits = calculatePackageCredits(Number(packageSize));
```

The returned values are then used to:

- insert `package_size` into `package_purchases`
- insert `bonus_cups` into `package_purchases`
- insert `total_cups_added` into `package_purchases`
- calculate and store `amount_paid_cents`
- increase `customer_accounts.current_balance`
- write an admin action log message describing the package purchase

This connects the package credit rule to the owner-facing operational workflow.

### `tests/customer-balance.test.js`

This file includes direct tests for the package credit calculation.

Why it exists:

The package credit function affects customer balances and shop revenue records. A defect in the calculation would be a business defect, not just a technical defect. Focused tests ensure the business rule remains stable as the application grows.

What problem it solves:

It catches regressions in the package bonus rules, especially changes to the 30-cup package. The current implemented behavior requires a 30-cup package to credit 33 cups.

How it works:

The test imports `calculatePackageCredits` from `models/cup-balance.js` and asserts the complete returned object for each approved package size. It also asserts that an unsupported package size is rejected.

The covered cases are:

- 10 cup package credits 11 total cups.
- 20 cup package credits 22 total cups.
- 30 cup package credits 33 total cups.
- invalid package size is rejected.

## 5. Database Changes

Story 1.5 did not create or modify the database schema directly.

This is intentional. The story's responsibility was to create the calculation rule, not to persist purchases. Separating calculation from persistence keeps the business rule testable without requiring SQLite setup and keeps the foundational story small enough to validate independently.

The delivered calculation is used by later persistence logic that writes to the following database fields:

- `package_purchases.package_size`
- `package_purchases.bonus_cups`
- `package_purchases.total_cups_added`
- `package_purchases.amount_paid_cents`
- `customer_accounts.current_balance`

The database impact is therefore indirect but important. The calculation determines the values that are stored when a package purchase is recorded.

## 6. Routes Added

Story 1.5 did not add Express routes.

No owner route, customer route, shared token route, or API route was created by this story. This was the correct implementation boundary because the story focused on the reusable business rule. Routes that later record purchases can call the package purchase model, and that model can safely call the calculation function.

The delivered application later uses the calculation through the admin package purchase workflow, but route creation itself belongs to the package purchase workflow rather than to this foundational calculation story.

## 7. Models Added

### `models/cup-balance.js`

This model was added as the source of truth for cup credit calculation.

Why it exists:

The application needed a stable model-level rule for package credits before implementing purchase forms, balance updates, and customer history. A model file is the right layer because the rule is business logic, not presentation logic and not database schema.

What problem it solves:

It prevents inconsistencies between UI preview, purchase persistence, dashboard reporting, and customer portal display. It also provides a natural place to update package rules if the shop changes its bonus policy in the future.

How it works:

The function is implemented with explicit branches:

- If the normalized package size is `10`, return `bonusCups: 1` and `totalCupsAdded: 11`.
- If the normalized package size is `20`, return `bonusCups: 2` and `totalCupsAdded: 22`.
- If the normalized package size is `30`, return `bonusCups: 3` and `totalCupsAdded: 33`.
- Otherwise, throw an invalid package size error.

This implementation favors readability over unnecessary abstraction. The shop has only three package sizes, so explicit branches are easier to inspect and less error-prone than a hidden mapping or configurable rule engine for the MVP.

## 8. UI Components Added

Story 1.5 did not add UI components.

This is deliberate. The calculation needed to exist before owner-facing package purchase UI could depend on it. Later UI components display package previews, calculated amount paid, bonus notes, and total cups credited, but this story does not create those views.

The absence of UI work in this story protects the implementation from mixing calculation correctness with presentation concerns. It also keeps the function usable in non-UI contexts such as tests and future reporting.

## 9. Business Logic Implemented

The main business logic implemented by this story is package credit calculation.

The implemented business rule is:

| Purchased Cups | Bonus Cups | Total Cups Credited |
|---:|---:|---:|
| 10 | 1 | 11 |
| 20 | 2 | 22 |
| 30 | 3 | 33 |

Why it exists:

The coffee shop sells prepaid cup packages and applies bonus cups to specific package sizes. The owner needs the app to apply these rules automatically so the customer balance is accurate.

What problem it solves:

It removes manual bonus calculation from the owner workflow. It also creates a durable system rule that supports customer trust. Customers can log in or open a shared balance link and see balances that are calculated consistently from purchase records.

How it works:

`calculatePackageCredits` accepts package size input. The input may come from a form submission, where values are commonly strings. The function normalizes the input with `Number(packageSize)`, allowing values like `"10"` to be treated as `10`.

After normalization, the function returns a fixed object for supported values. The returned object is intentionally structured so downstream code does not need to recalculate or infer fields.

The result includes:

- `packageSize`: the purchased cup count.
- `bonusCups`: the bonus cups granted by the package.
- `totalCupsAdded`: the total number of cups that should be added to the customer balance.

## 10. Validation Rules

The validation rule implemented by this story is package size validation.

Accepted values:

- `10`
- `20`
- `30`

Rejected values:

- Any unsupported number, such as `15`.
- Any value that does not normalize to one of the accepted package sizes.

Why it exists:

The app must not silently accept arbitrary package sizes because the business only supports the approved package options. Accepting unsupported sizes would make balance behavior ambiguous and could create records that do not match the shop's pricing and bonus policy.

What problem it solves:

It prevents invalid package credit calculations at the model level. Even if a UI form were accidentally changed or bypassed, the server-side calculation still rejects unsupported package sizes.

How it works:

If the normalized package size is not `10`, `20`, or `30`, the function throws an error with a clear message:

```text
Invalid package size. Package size must be 10, 20, or 30.
```

This error can be handled by calling code in route handlers or model workflows.

## 11. Security Controls

Story 1.5 does not implement authentication, authorization, CSRF protection, password hashing, or route protection directly.

However, it contributes to security and operational safety in a narrower way: it enforces server-side business validation. Server-side validation is important because UI controls alone are not sufficient. A malicious or mistaken request could submit a value that is not one of the approved package sizes. The model-level function rejects invalid sizes before they can become package credit data.

The function also avoids using client-controlled bonus cup values. The owner-facing workflow can submit the purchased package size, but the bonus cups and total credited cups are derived by server-side logic. This prevents tampering with hidden form values or browser-side preview values.

## 12. Test Coverage

The package credit calculation is covered by `tests/customer-balance.test.js`.

The tests use Node's built-in test framework and `node:assert/strict`.

Implemented test coverage includes:

- 10-cup package returns `packageSize: 10`, `bonusCups: 1`, and `totalCupsAdded: 11`.
- 20-cup package returns `packageSize: 20`, `bonusCups: 2`, and `totalCupsAdded: 22`.
- 30-cup package returns `packageSize: 30`, `bonusCups: 3`, and `totalCupsAdded: 33`.
- Invalid package size throws an error matching `Invalid package size`.

Why it exists:

These tests protect the most important balance calculation rule in the app. Because package credits affect balances, dashboards, history, and customer-visible information, the rule needs focused automated verification.

What problem it solves:

The tests provide fast feedback if a future change accidentally reverts the 30-cup rule to 30 credited cups, changes the 20-cup bonus, or allows unsupported package sizes.

How it works:

The tests import the function directly:

```js
const { calculatePackageCredits } = require('../models/cup-balance');
```

They do not require Express startup, database setup, session configuration, or browser automation. This keeps the foundational business rule test isolated and quick to run.

## 13. How This Supports The User Workflow

This story supports the owner workflow by turning package credit rules into reliable application behavior.

In the delivered app, the owner can record package purchases for a customer. The package purchase flow uses this calculation to determine how many cups are credited to the customer's account. The customer balance then increases by the credited amount, and the customer can later see the resulting balance in the read-only customer portal or shared balance link.

The story also supports customer trust. Customers do not see the internal calculation function, but they depend on the output. When a customer buys a 20-cup package, the app needs to consistently credit 22 cups. When a customer buys a 30-cup package, the app needs to consistently credit 33 cups. This story provides that consistency.

The calculation also supports future maintainability. If the shop changes package rules again, the primary model-level rule can be updated in one place and verified with focused tests.

## 14. Delivered Output

The delivered output of Story 1.5 is a working package credit calculation module with test coverage and downstream usage in the package purchase model.

Delivered implementation includes:

- `models/cup-balance.js`
- `calculatePackageCredits(packageSize)`
- support for 10-cup packages
- support for 20-cup packages
- support for 30-cup packages
- invalid package size rejection
- export of the calculation function
- direct usage by `models/package-purchase.js`
- direct automated tests in `tests/customer-balance.test.js`

The story is complete because the package credit rule is implemented, reusable, testable, and connected to the current application behavior.

## 15. Evidence From Current Web App

Evidence from the current codebase confirms that Story 1.5 is implemented.

### Model Evidence

`models/cup-balance.js` contains the package credit source of truth:

- `calculatePackageCredits(10)` returns 11 total credited cups.
- `calculatePackageCredits(20)` returns 22 total credited cups.
- `calculatePackageCredits(30)` returns 33 total credited cups.
- unsupported package sizes throw a validation error.

### Purchase Workflow Evidence

`models/package-purchase.js` imports and uses `calculatePackageCredits`.

The package purchase model uses the calculated result to:

- calculate stored purchase fields
- update the customer balance
- record an admin action log
- return the recorded purchase summary

### Database Evidence

The database stores values produced by the package credit calculation in the package purchase workflow:

- `package_size`
- `bonus_cups`
- `total_cups_added`
- `amount_paid_cents`

The customer's balance is updated by the calculated `totalCupsAdded`.

### Test Evidence

`tests/customer-balance.test.js` validates the supported package rules and invalid package rejection.

### Route And UI Evidence

Story 1.5 does not create routes or UI directly. The current owner purchase workflow depends on this rule through the package purchase model, which means route and UI behavior are indirectly supported by this story.

## 16. Story Status

Story 1.5 is implemented.

Story 1.5 is delivered.

The package credit calculation is present in the current application, covered by focused tests, and used by the package purchase workflow that updates customer balances.
