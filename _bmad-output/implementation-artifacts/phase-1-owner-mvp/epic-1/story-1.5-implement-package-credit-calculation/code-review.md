# Story 1.5: Implement Package Credit Calculation

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: Approve

Workflow context: BMAD code-review output

Status: Reviewed

## Review Scope

This code review evaluates the implemented Story 1.5: Implement Package Credit Calculation. The review uses the completed application as the source of truth and focuses on the delivered business rule in `models/cup-balance.js`, the way that rule is consumed by `models/package-purchase.js`, and the direct automated coverage in `tests/customer-balance.test.js`.

Reviewed implementation areas:

- `models/cup-balance.js`
- `models/package-purchase.js`
- `tests/customer-balance.test.js`

The purpose of this story was to create a reusable server-side rule for converting an approved package size into credited cups. That rule is foundational because it directly affects balance accuracy, customer trust, owner workflow speed, purchase history correctness, and downstream reporting.

## Architecture Compliance

The implementation complies with the approved architecture.

The application is structured as a single Express web application with SQLite persistence and model-level business logic. The package credit rule is implemented in `models/cup-balance.js`, which is the correct architectural location because this rule is domain logic, not route orchestration, not UI rendering, and not database infrastructure.

This separation matters. If the package credit rule were embedded directly in route handlers or views, it would be harder to test and easier to duplicate incorrectly. The current implementation keeps the rule centralized and allows later workflows to reuse it through model imports.

The package purchase model consumes the calculation rather than re-implementing it. That shows the architecture is being used correctly: foundational business logic is defined once and used downstream.

Finding: Architecture compliance is strong. The rule is implemented at the proper layer and reused by later purchase logic.

## Coding Standards

The implementation follows the coding style used across the project.

`models/cup-balance.js` is small, readable, and explicit. It uses a named function, local normalization of the input value, and CommonJS exports. The branch structure is straightforward and easy to audit:

- normalize input with `Number(packageSize)`
- check supported package sizes
- return a structured object
- throw a clear error for unsupported values

The naming is appropriate:

- `calculatePackageCredits`
- `packageSize`
- `bonusCups`
- `totalCupsAdded`

These names are business-meaningful and reduce ambiguity for later consumers.

The implementation avoids unnecessary abstraction. A mapping table would also have worked, but with only three approved package sizes, explicit branches are acceptable and arguably clearer for a small-shop MVP.

Finding: Coding standards are met. The code is readable, consistent, and maintainable.

## Security Review

This story does not implement authentication, authorization, sessions, password handling, or CSRF protection directly. That is appropriate because Story 1.5 is limited to business calculation logic.

The relevant security concern for this story is server-side enforcement of package rules. The implementation handles this correctly by deriving bonus cups and total credited cups on the server rather than trusting client-supplied values.

This matters because owner UI previews or browser-side form values should never be considered authoritative. The delivered function ensures that the application determines the credited amount from the submitted package size using server-side logic.

The rejection of unsupported package sizes is also a security and integrity control. It prevents malformed or manipulated requests from creating unsupported credit outcomes.

Finding: Security behavior is appropriate for the story's scope. The main protection provided is server-side rule enforcement and rejection of unsupported package sizes.

## Validation Review

Validation is implemented at the model level through explicit package size checks.

Accepted package sizes:

- `10`
- `20`
- `30`

Rejected package sizes:

- unsupported numeric values such as `15`
- values that do not normalize to one of the approved package sizes

The function normalizes input with `Number(packageSize)`, which is practical because route/form inputs often arrive as strings. This allows approved string inputs like `"10"` to be interpreted correctly without pushing parsing concerns into every caller.

When validation fails, the function throws a clear and specific error:

```text
Invalid package size. Package size must be 10, 20, or 30.
```

That error is precise enough for calling code and tests to reason about.

Finding: Validation is correctly implemented for the story's scope and supports both safe reuse and testability.

## Database Integrity Review

Story 1.5 does not change the schema directly, which is correct. The story's responsibility is calculation, not persistence.

However, the story has a direct effect on data integrity because the values it returns are later stored by `models/package-purchase.js` in:

- `package_purchases.package_size`
- `package_purchases.bonus_cups`
- `package_purchases.total_cups_added`
- `customer_accounts.current_balance`

The package purchase model correctly reuses `calculatePackageCredits` instead of recalculating the values independently. That helps preserve data integrity by ensuring stored purchase fields and balance updates come from the same source of truth.

Finding: Database integrity support is strong. While this story does not own schema, it protects persisted balance data by centralizing the credit rule.

## Error Handling Review

The calculation function uses explicit failure behavior rather than silent fallback behavior.

This is the correct design for a financial-style ledger rule. If an unsupported package size is supplied, the function throws an error instead of returning a partial result, defaulting to zero, or coercing the value into another package tier.

That approach reduces the risk of hidden business defects. An invalid package size should stop the workflow so the issue can be corrected.

The error message is specific and aligned with the approved package options.

Finding: Error handling is appropriate and intentionally strict, which is the right choice for a balance-affecting business rule.

## UI Consistency Review

Story 1.5 has no direct UI output.

No admin screen, customer screen, QR view, balance card, dashboard section, or navigation element is implemented by this story. That is correct. The calculation rule belongs in the model layer and should remain usable independently of the UI.

The story does support UI consistency indirectly. Owner purchase forms and customer-facing balance screens depend on accurate credited cup values. By keeping the rule centralized, the app reduces the risk that one interface previews one number while the persisted result uses another.

Finding: UI consistency is preserved through centralized server-side business logic rather than direct presentation code.

## Test Coverage Review

Test coverage is focused and appropriate for the story.

`tests/customer-balance.test.js` directly verifies:

- 10-cup package returns 11 total credited cups
- 20-cup package returns 22 total credited cups
- 30-cup package returns 33 total credited cups
- invalid package size is rejected

The tests assert the full returned object rather than only a single field. That is a stronger verification approach because it checks:

- `packageSize`
- `bonusCups`
- `totalCupsAdded`

The tests are isolated. They do not require Express startup, SQLite setup, sessions, or browser rendering. This is appropriate because the calculation is pure model logic.

One gap remains: there is no explicit direct test for string input normalization such as `"10"`. The implementation supports it through `Number(packageSize)`, and downstream route flows likely exercise this indirectly, but a direct unit test would make that behavior clearer.

Finding: Test coverage is good and focused. A small additional normalization test would improve completeness.

## Findings

1. `models/cup-balance.js` correctly centralizes the package credit rule.
2. The calculation function is pure and side-effect free.
3. The implementation supports the delivered package rules: `10 -> 11`, `20 -> 22`, `30 -> 33`.
4. Invalid package sizes are explicitly rejected with a clear error.
5. The returned structure is business-friendly and reusable by downstream code.
6. `models/package-purchase.js` reuses the calculation instead of duplicating the rule.
7. The calculation directly supports persisted purchase records and balance updates.
8. `tests/customer-balance.test.js` provides direct coverage for supported and invalid cases.
9. The implementation is small, readable, and easy to maintain.

## Issues

No critical issues found.

No high-priority issues found.

Medium issue: The rule is implemented with explicit branches rather than a shared configuration object or constant map. This is acceptable for three package sizes, but if package offerings expand further, maintainability could decline unless the rule representation is refactored.

Low issue: There is no direct unit test proving that string inputs such as `"10"` normalize correctly, even though the implementation supports that behavior.

Low issue: There is no direct route-level test in this story artifact proving that invalid package sizes are surfaced cleanly through the owner purchase workflow. The current unit test coverage is still sufficient for the foundational calculation itself.

## Recommendations

1. Keep `calculatePackageCredits` as the only source of truth for package bonus logic.
2. Continue deriving `bonusCups` and `totalCupsAdded` on the server rather than accepting client-supplied values.
3. Add a direct unit test for string normalization in a future test hardening pass.
4. If package offerings grow beyond the current three fixed tiers, consider moving the rule to a well-named configuration map while keeping the same model-level interface.
5. Preserve the current strict invalid-package behavior. Do not introduce silent fallback logic.

## Approval Decision

The implemented Story 1.5 meets the requirements for the Owner MVP foundation. The calculation rule is architecturally well placed, easy to read, appropriately validated, and directly connected to the purchase workflow that updates balances.

The issues identified are minor improvements and do not block acceptance. The story delivers the core business rule needed for reliable package purchases and customer balance tracking.

## APPROVED
