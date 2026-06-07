# Story 6.2: Add Dashboard Tests

Phase: Phase 1: Owner MVP

Epic: Epic 6: Basic Owner Dashboard

Output type: `story-[slug].md`

Status: Reconstructed retrospective implementation story

## Story Title

Add Dashboard Tests

## Business Context

The Barista Coffee Membership application now has an owner dashboard that summarizes the membership business through live ledger metrics and recent activity. That dashboard is useful only if the numbers remain trustworthy as the codebase changes.

Story 6.2 exists to protect the dashboard from regression. The owner dashboard summarizes the business in a way that affects daily operational decisions, so its totals, low-balance panel, and recent activity panel must remain accurate over time.

The completed application shows that the correct interpretation of this story is not “add a few extra tests.” It is “protect the owner dashboard as a core business summary surface.”

## User Story

As the development team, I want automated tests for the owner dashboard so that its metrics and recent activity remain correct as the application evolves.

## Acceptance Criteria

1. Automated tests verify the total number of customers on the dashboard.
2. Automated tests verify the total outstanding cups shown on the dashboard.
3. Automated tests verify the recorded package revenue shown on the dashboard.
4. Automated tests verify the total cups delivered shown on the dashboard.
5. Automated tests verify the total bonus cups shown on the dashboard.
6. Automated tests verify that low-balance customers appear on the dashboard.
7. Automated tests verify that recent deliveries appear on the dashboard.
8. Automated tests verify that the dashboard remains owner-protected.
9. Automated tests verify that dashboard totals remain correct after voided deliveries.
10. The test coverage reflects the actual dashboard behavior in the completed application.

## Functional Requirements

The test suite must verify the dashboard’s customer count metric.

The test suite must verify the dashboard’s outstanding cup total.

The test suite must verify the dashboard’s recorded package revenue total.

The test suite must verify the dashboard’s delivered cup total.

The test suite must verify the dashboard’s bonus cup total.

The test suite must verify the presence of low-balance customers on the dashboard.

The test suite must verify the presence of recent delivery activity on the dashboard.

The test suite must verify that recent activity links back to the correct customer records.

The test suite must verify that the dashboard route remains protected behind owner authentication.

The test suite must verify that dashboard totals remain correct after a delivery is voided.

## Non-Functional Requirements

The tests must be reliable and repeatable.

The tests must run against isolated SQLite databases.

The tests must target business outcomes rather than brittle presentation details.

The tests must protect the dashboard from regressions in metrics or data sourcing.

The tests must remain maintainable as future owner reporting work is added.

## UI Requirements

The tests must validate the existing dashboard UI, not redesign it.

The tests should confirm that the metric cards, low-balance table, and recent deliveries panel render correctly.

The tests should confirm that the recent deliveries panel links the owner back to the customer records.

The tests should confirm that the dashboard stays concise and readable as an operational summary.

## Database Requirements

The tests must exercise the existing customer_accounts, package_purchases, and delivery_history tables.

The tests must verify that voided deliveries are excluded from active totals.

The tests must verify that the dashboard calculates live metrics from current ledger data.

No database schema changes are required for this story.

## Technical Notes

The delivered application shows that dashboard behavior is implemented in `models/dashboard.js` and rendered through `routes/admin.js`.

`tests/phase1-owner.test.js` covers the dashboard summary metrics and low-balance/recent-activity display.

`tests/e2e-owner-customer-flow.test.js` proves that the dashboard remains accurate after actual delivery and void operations in the owner workflow.

The test strategy uses isolated SQLite databases so the metrics can be seeded deterministically.

This story intentionally does not add new production code. It protects the dashboard implementation by covering the already-delivered behavior.

## Testing Requirements

The test suite must include:

- metric assertions for customers, balances, revenue, deliveries, and bonus cups
- low-balance customer display assertions
- recent delivery display and customer-link assertions
- owner authentication checks for the dashboard route
- void-aware dashboard assertions

The tests should fail if the dashboard starts reading from the wrong tables, counting voided deliveries incorrectly, or losing the low-balance or recent-activity panels.

## Definition Of Done

The story is done when the owner dashboard is protected by automated tests that prove its metrics, panels, and access control remain correct against live ledger data.

The story is not done if it only checks page rendering, if voided deliveries are still counted in totals, or if the dashboard route is no longer owner-protected.

## Expected Delivered Output

The expected delivered output is a regression test suite that protects the dashboard by covering:

- live metric totals
- low-balance customer visibility
- recent delivery activity
- owner-only access
- void-aware accuracy

The completed application confirms that Story 6.2 delivered the dashboard coverage required to protect the Phase 1 owner MVP summary view.
