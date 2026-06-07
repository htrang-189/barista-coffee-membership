# Story 6.2: Add Dashboard Tests

Phase: Phase 1: Owner MVP

Epic: Epic 6: Basic Owner Dashboard

Output type: `epic.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 6.2 was to protect the owner dashboard from regressions by adding automated test coverage for its summary metrics and recent activity panels. The owner dashboard is the first page that turns the ledger into a business overview, so it must remain accurate as the application evolves.

The completed application shows that the dashboard is valuable precisely because it summarizes live ledger behavior. That also makes it sensitive to change. If the totals drift or the recent activity view stops reflecting the ledger correctly, the owner loses trust in the dashboard very quickly. Story 6.2 exists to protect that trust.

## Epic Objective

Epic 6: Basic Owner Dashboard exists to give the owner a concise operational overview of the membership program. Story 6.1 delivers the dashboard itself. Story 6.2 completes the epic by making that dashboard testable and resilient.

The epic objective for this story is to:

- verify the owner dashboard metrics remain correct
- verify the low-balance panel continues to surface the right customers
- verify the recent deliveries panel remains accurate
- verify the dashboard route remains owner-protected

## Story Objective

The objective of Story 6.2 was to add automated tests that validate the owner dashboard metrics, low-balance customer section, and recent delivery activity panel.

Using the completed application as the source of truth, this includes coverage for:

- total customer count
- total outstanding cups
- recorded package revenue in VND
- total cups delivered
- total bonus cups granted
- low-balance customer display
- recent deliveries display
- owner authentication protection
- dashboard accuracy after voided deliveries

## User Value

The primary user value is confidence.

The owner depends on the dashboard to understand the current state of the business. Tests keep that summary trustworthy when other parts of the ledger change. They reduce the risk that a future update will silently break the numbers or hide important operational cues.

There is also team value. Once the dashboard has tests, future development can move faster with less fear of breaking the owner summary view. That improves maintainability of the MVP.

At the product level, tests reinforce that the dashboard is not decorative. It is a real operational tool backed by real data.

## Acceptance Criteria

1. Automated tests verify the total number of customers on the dashboard.
2. Automated tests verify the total outstanding cups shown on the dashboard.
3. Automated tests verify the recorded package revenue shown on the dashboard.
4. Automated tests verify the total cups delivered shown on the dashboard.
5. Automated tests verify the total bonus cups shown on the dashboard.
6. Automated tests verify that low-balance customers appear on the dashboard.
7. Automated tests verify that recent deliveries appear on the dashboard.
8. Automated tests verify that the dashboard remains owner-protected.
9. Automated tests verify that dashboard totals remain correct after delivery voids.
10. The test coverage reflects the real dashboard behavior in the application.

## Dependencies

Story 6.2 depends on the dashboard behavior introduced in Story 6.1 and on the transactional ledger already implemented in earlier stories.

Prerequisite dependencies:

- Story 1.1: Build Local Express And SQLite Foundation
- Story 1.2: Establish Configuration, Data Access, And Test Foundation
- Story 2.1: Implement Owner Authentication And Route Protection
- Story 3.1: Implement Customer Account Management
- Story 3.2: Add Customer Search, Detail, And Validation Coverage
- Story 4.1: Implement Package Purchase, Fixed Pricing, And Bonus Crediting
- Story 4.2: Add Package Purchase History And Tests
- Story 5.1: Implement Multi-Cup Delivery And Balance Protection
- Story 5.2: Implement Void Delivery And Delivery History
- Story 5.3: Add Delivery Tests
- Story 6.1: Implement Owner Dashboard Metrics And Recent Activity

Technical dependencies:

- `models/dashboard.js`
- `routes/admin.js`
- `tests/phase1-owner.test.js`
- `tests/e2e-owner-customer-flow.test.js`
- SQLite test setup helpers

Downstream dependencies:

- final QA summary
- future owner reporting stories
- any later dashboard or summary enhancements

## Risks

### Risk 1: Dashboard metrics regress without notice

If the dashboard is not covered, future changes to the ledger can silently break the numbers.

Mitigation:
Add direct tests for each metric and for the low-balance and recent-activity panels.

### Risk 2: Voided deliveries skew the dashboard

If the dashboard tests do not account for voided deliveries, the totals may drift from business reality.

Mitigation:
Assert that voided deliveries are excluded from active totals.

### Risk 3: The dashboard becomes inaccessible or unprotected

If route protection regresses, the dashboard could leak business data.

Mitigation:
Test that the route remains owner-authenticated.

### Risk 4: The recent activity panel stops linking correctly

If customer links break, the dashboard loses operational value.

Mitigation:
Assert that recent deliveries link back to the relevant customer record.

### Risk 5: The suite becomes too shallow

If only the visible page title is checked, the dashboard can still be wrong internally.

Mitigation:
Assert business totals, list content, and post-void behavior rather than only surface rendering.

## Priority

Priority: High

This story is high priority because the dashboard is the owner’s operational summary. A broken dashboard is immediately misleading and undermines trust in the rest of the system.

## Success Metrics

The story is successful when the dashboard can be changed safely and still remain trustworthy.

Business-capability success metrics:

- the dashboard metric values are verified by tests
- low-balance customers remain visible
- recent deliveries remain visible and linked
- dashboard totals remain correct after ledger corrections

Quality metrics:

- the tests fail when the dashboard numbers break
- the tests pass against the delivered application
- the dashboard behavior remains reproducible

Delivered evidence in the current application includes:

- `tests/phase1-owner.test.js`
- `tests/e2e-owner-customer-flow.test.js`
- `models/dashboard.js`
- `routes/admin.js`

## Success Criteria Traceability To Delivered Application

The completed application confirms that Story 6.2 should be understood as the dashboard regression-protection story.

Implemented evidence includes:

- dashboard metric checks in `tests/phase1-owner.test.js`
- void-aware dashboard verification in `tests/e2e-owner-customer-flow.test.js`
- owner dashboard logic in `models/dashboard.js`
- dashboard rendering in `routes/admin.js`

The current application therefore confirms that Story 6.2 is the test coverage companion to the owner dashboard summary delivered in Story 6.1.
