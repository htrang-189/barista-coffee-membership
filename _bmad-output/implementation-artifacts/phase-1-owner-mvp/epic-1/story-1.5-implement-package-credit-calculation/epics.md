# Story 1.5: Implement Package Credit Calculation

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 1.5 is to make package crediting reliable before the owner records package purchases. The coffee shop sells prepaid cup packages, and each purchase must add the correct number of cups to the customer's balance. The app cannot function as a trustworthy prepaid cup ledger if the credited cup total is ambiguous, manually calculated, or duplicated across different parts of the system.

This story supports the business by turning the package bonus policy into a single server-side rule. The delivered rule is:

- 10 purchased cups credit 11 total cups.
- 20 purchased cups credit 22 total cups.
- 30 purchased cups credit 33 total cups.

This matters because package credits directly affect customer balances. Incorrect credits can either shortchange customers or cost the shop revenue. A centralized calculation reduces that risk and makes the later package purchase workflow safer.

## Epic Objective

Epic 1: Application Foundation creates the reusable technical and business-rule base for the Owner MVP. Story 1.5 belongs in this epic because package credit calculation is foundational business logic used by later workflows.

The epic objective is not only to create an Express app and database. It must also establish the small set of core rules that later owner workflows depend on. Package credit calculation is one of those rules. Package purchase recording, balance updates, dashboard metrics, package histories, and customer-facing balance views all rely on the same credited-cup total.

## Story Objective

The story objective is to implement a reusable package credit calculation function.

The function must accept a package size and return:

- the normalized package size,
- the number of bonus cups,
- the total cups added to the customer balance.

The function must reject unsupported package sizes. It must not write to the database or depend on route/UI state. It should be a pure calculation so it can be tested directly and reused safely.

The completed application implements this objective in `models/cup-balance.js` through `calculatePackageCredits(packageSize)`.

## User Value

The owner receives a reliable, automated package credit rule. When a customer buys a prepaid package, the owner does not need to manually calculate bonus cups. This reduces mistakes during customer service and keeps the membership ledger consistent.

Customers receive indirect value because their balances and histories are based on a tested rule. The customer portal and shared balance link later show package history and remaining cups based on the same underlying calculation.

The implementation team receives value because the package credit rule can be reused by package purchase logic and tested without database setup.

## Acceptance Criteria

1. A central package credit calculation module exists.
2. The module exports a reusable calculation function.
3. The function accepts package size input.
4. The function normalizes package size to a number.
5. Package size `10` returns `packageSize: 10`, `bonusCups: 1`, and `totalCupsAdded: 11`.
6. Package size `20` returns `packageSize: 20`, `bonusCups: 2`, and `totalCupsAdded: 22`.
7. Package size `30` returns `packageSize: 30`, `bonusCups: 3`, and `totalCupsAdded: 33`.
8. Unsupported package sizes are rejected.
9. The invalid package size error is clear.
10. The function has no database side effects.
11. The function does not depend on Express routes or request objects.
12. The function does not depend on browser-side JavaScript.
13. Package purchase logic can reuse the function.
14. Automated tests can import and validate the function directly.

## Dependencies

Story 1.5 depends on the application foundation and model folder being available.

Prerequisite dependencies:

- Story 1.1: Express and SQLite application foundation.
- Story 1.2: Environment configuration, indirectly supporting the app foundation.
- Story 1.3: SQLite schema and setup, which later package purchase records use.
- Story 1.4: Database connection helper, which later package purchase model logic uses.

Downstream dependencies:

- Package purchase recording.
- Transactional customer balance updates.
- Dashboard bonus-cup metrics.
- Owner customer detail purchase history.
- Customer portal package history.
- Shared balance-link package history.
- Automated package purchase workflow tests.

## Risks

Risk: Package bonus rules are duplicated across server, UI, and tests.

Impact: The app could show one credited total in the UI but update the balance with a different total.

Mitigation: Make `models/cup-balance.js` the server-side source of truth and test it directly.

Risk: Unsupported package sizes are accepted.

Impact: Invalid packages could be credited to customer balances.

Mitigation: Reject any value other than 10, 20, or 30.

Risk: Early package assumptions remain stale.

Impact: The 30-cup package could incorrectly credit only 30 cups instead of 33.

Mitigation: Use the completed application's source-of-truth rule: `30 -> 33`.

Risk: The calculation becomes coupled to database or UI behavior.

Impact: The rule becomes harder to test and reuse.

Mitigation: Keep the calculation as a pure model function with no side effects.

## Priority

Priority: High

This story is high priority because package purchase recording cannot safely proceed until credited-cup calculation is reliable. The story is small but has high business impact because it directly affects customer balances.

## Success Metrics

Success metric 1: The calculation function returns correct values for 10, 20, and 30 cup packages.

Success metric 2: Unsupported package sizes throw an error.

Success metric 3: Foundation tests pass for all package credit cases.

Success metric 4: Package purchase workflow uses the central function instead of duplicating the rule.

Success metric 5: Customer balances increase by `purchased cups + bonus cups`.

Success metric 6: Dashboard bonus metrics reflect the same bonus values.

Success metric 7: Customer-facing package histories display credited package information consistently.

## Traceability To Completed Application

The completed application confirms that Story 1.5 was delivered.

Delivered evidence:

- `models/cup-balance.js` exists.
- `calculatePackageCredits` returns `10 -> 11`, `20 -> 22`, and `30 -> 33`.
- Unsupported package sizes throw an invalid package size error.
- `models/package-purchase.js` imports and uses the calculation.
- `tests/customer-balance.test.js` validates supported and invalid package sizes.
- Owner package purchase UI preview reflects the delivered rule.
- Dashboard bonus metrics and customer histories reflect the credited-cup rule.
