# Story 1.5: Implement Package Credit Calculation

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `story-[slug].md`

Workflow context: BMAD create-story output

Status: Reconstructed retrospective story document

## Story Title

Implement Package Credit Calculation

## Business Context

The Barista Coffee Membership application is an owner-operated prepaid cup ledger. The coffee shop owner records package purchases, and the app must determine how many cups are credited to the customer balance. This credit calculation is one of the most important business rules in the product because it directly affects remaining cups, used cups, package history, dashboard metrics, and customer trust.

For the MVP, the shop supports three package sizes. Each package has a purchased cup count and an associated bonus rule. The delivered application uses the following source-of-truth rules:

- 10 purchased cups credits 11 total cups.
- 20 purchased cups credits 22 total cups.
- 30 purchased cups credits 33 total cups.

The owner should not calculate bonus cups manually. Manual calculation would create operational risk, especially when the owner is serving customers quickly. This story turns the package credit policy into a reusable server-side calculation so later workflows can safely record purchases and update balances.

This story is part of Application Foundation because it creates foundational business logic before the package purchase workflow is implemented. It is not a UI story and not a database-write story. It is a pure calculation story that later package purchase, dashboard, and customer-facing features depend on.

## User Story

As the coffee shop owner,

I want the app to calculate credited cups automatically from the purchased package size,

So that customer balances are updated consistently according to the shop's package bonus rules and I do not need to manually calculate bonus cups.

## Acceptance Criteria

1. A package credit calculation module exists.
2. The module exports a reusable calculation function.
3. The function accepts a package size input.
4. The function normalizes package size input to a number.
5. A 10-cup package returns `packageSize: 10`.
6. A 10-cup package returns `bonusCups: 1`.
7. A 10-cup package returns `totalCupsAdded: 11`.
8. A 20-cup package returns `packageSize: 20`.
9. A 20-cup package returns `bonusCups: 2`.
10. A 20-cup package returns `totalCupsAdded: 22`.
11. A 30-cup package returns `packageSize: 30`.
12. A 30-cup package returns `bonusCups: 3`.
13. A 30-cup package returns `totalCupsAdded: 33`.
14. Unsupported package sizes are rejected.
15. The invalid package size error clearly states that package size must be 10, 20, or 30.
16. The function does not update customer balances.
17. The function does not write to the database.
18. The function does not depend on Express route handlers.
19. The function does not depend on browser-side JavaScript.
20. The function can be imported by package purchase logic.
21. The function can be tested directly.

## Functional Requirements

The application must provide a server-side function for calculating package credits.

The function must support exactly three package sizes: 10, 20, and 30 purchased cups.

The function must return a structured object that includes:

- `packageSize`
- `bonusCups`
- `totalCupsAdded`

The function must reject all unsupported package sizes.

The function must be deterministic. The same package size must always return the same credit result.

The function must be reusable by later model logic that records package purchases.

The function must be independent from UI preview behavior. UI may display the same values, but the server-side function remains the authoritative calculation.

## Non-Functional Requirements

The calculation must be simple, readable, and maintainable.

The calculation must be side-effect free.

The calculation must not require database setup.

The calculation must not require application startup.

The calculation must be fast enough to run during every package purchase request without measurable overhead.

The calculation must be easy to update if the shop changes package rules in the future.

The calculation must be covered by focused automated tests because incorrect package credits directly affect customer balances.

## UI Requirements

This story has no direct UI requirement.

No owner-facing form should be created by this story.

No customer-facing page should be created by this story.

No dashboard card, purchase history section, balance display, QR/share link section, or notification component should be created by this story.

Later owner UI may show package credit previews. Those previews must remain aligned with this server-side rule.

## Database Requirements

This story has no direct database requirement.

The function must not create package purchase records.

The function must not update `customer_accounts.current_balance`.

The function must not insert rows into `package_purchases`.

The function must not create or modify schema.

Later package purchase logic will store values derived from this function in:

- `package_purchases.package_size`
- `package_purchases.bonus_cups`
- `package_purchases.total_cups_added`

## Technical Notes

The completed application implements the story in:

- `models/cup-balance.js`

The delivered function is:

- `calculatePackageCredits(packageSize)`

The function converts input with:

```js
Number(packageSize)
```

The delivered behavior is:

- `calculatePackageCredits(10)` returns `{ packageSize: 10, bonusCups: 1, totalCupsAdded: 11 }`.
- `calculatePackageCredits(20)` returns `{ packageSize: 20, bonusCups: 2, totalCupsAdded: 22 }`.
- `calculatePackageCredits(30)` returns `{ packageSize: 30, bonusCups: 3, totalCupsAdded: 33 }`.

Unsupported values throw:

```text
Invalid package size. Package size must be 10, 20, or 30.
```

The function is exported through CommonJS:

```js
module.exports = {
  calculatePackageCredits
};
```

## Testing Requirements

Automated tests must cover all supported package sizes.

Automated tests must assert the complete returned object for each supported package.

Automated tests must assert that unsupported package sizes throw an error.

Tests should import the calculation directly from `models/cup-balance.js`.

Tests should not require Express startup.

Tests should not require SQLite setup.

Tests should not require browser-side JavaScript.

The completed application validates this behavior in:

- `tests/customer-balance.test.js`

## Definition of Done

Story 1.5 is done when `models/cup-balance.js` exists.

Story 1.5 is done when `calculatePackageCredits` is implemented.

Story 1.5 is done when `calculatePackageCredits` is exported.

Story 1.5 is done when the 10-cup package returns 11 credited cups.

Story 1.5 is done when the 20-cup package returns 22 credited cups.

Story 1.5 is done when the 30-cup package returns 33 credited cups.

Story 1.5 is done when invalid package sizes are rejected.

Story 1.5 is done when the function has no database side effects.

Story 1.5 is done when the function can be reused by package purchase logic.

Story 1.5 is done when automated tests validate the supported and invalid cases.
