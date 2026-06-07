# Story 6.1: Implement Owner Dashboard Metrics And Recent Activity

Phase: Phase 1: Owner MVP

Epic: Epic 6: Basic Owner Dashboard

Output type: `epic.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 6.1 was to give the coffee shop owner a concise operational overview of the membership program without requiring them to drill into customer records. At this point in the MVP, the shop already had customers, package purchases, delivery records, and a customer portal foundation. The remaining need was a small but useful owner dashboard that summarized the state of the business and surfaced recent activity.

The completed application shows that the correct dashboard is not a generic BI surface. It is a practical working dashboard that answers the owner’s daily questions:

- how many customers exist
- how many cups are still outstanding
- how much revenue has been recorded from packages
- how many cups have been delivered
- how many bonus cups have been granted
- which customers are currently low on balance
- what recent deliveries just happened

That is the right business framing for the MVP because it supports immediate operational decisions without adding unnecessary complexity.

## Epic Objective

Epic 6: Basic Owner Dashboard exists to turn the ledger into a summary view that is useful in daily shop operations. The epic objective is to provide the owner with a compact dashboard that surfaces key metrics and recent activity, so they can monitor the membership business at a glance.

Story 6.1 is the core of that epic. It establishes the owner dashboard metrics and recent activity panel that later reporting or history stories can build on.

## Story Objective

The objective of Story 6.1 was to implement a basic owner dashboard with meaningful metrics and recent delivery activity.

Using the completed application as the source of truth, this includes:

- total customer count
- total outstanding cups across active customers
- recorded package revenue in VND
- total cups delivered
- total bonus cups granted
- a list of low-balance customers
- a recent deliveries panel with links to customer records

## User Value

The primary user is the coffee shop owner.

The owner gains immediate visibility into the state of the membership program. Instead of checking individual customers one at a time, the owner can see business health, low-balance risk, and recent activity in one place.

That reduces operational friction. It also helps the owner spot customers who need attention, confirm that packages are being sold, and see whether deliveries are flowing normally.

At the product level, the dashboard makes the owner MVP feel complete. The system is no longer just a set of transaction screens; it becomes a manageable business tool.

## Acceptance Criteria

1. The dashboard displays the total number of customers.
2. The dashboard displays the total outstanding cups across all customers.
3. The dashboard displays recorded package revenue in VND.
4. The dashboard displays total cups delivered.
5. The dashboard displays total bonus cups granted.
6. The dashboard lists customers with low balances.
7. The dashboard shows recent delivery activity.
8. The recent activity panel links back to the relevant customer record.
9. The dashboard is protected by owner authentication.
10. The dashboard behavior is covered by automated tests.

## Dependencies

Story 6.1 depends on the operational ledger that was built in earlier stories.

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

Technical dependencies:

- `models/dashboard.js`
- `customer_accounts.current_balance`
- `package_purchases`
- `delivery_history`
- admin-authenticated dashboard route

Downstream dependencies:

- dashboard test coverage
- customer-facing low-balance and recent-activity narratives
- future reporting and summary views

## Risks

### Risk 1: Metrics are misleading or incomplete

If the dashboard totals do not reflect the real ledger, the owner could make the wrong operational decisions.

Mitigation:
Compute metrics directly from the ledger tables and verify them with automated tests.

### Risk 2: Recent activity is not accurate

If voided deliveries are counted as active deliveries, the dashboard would misreport business activity.

Mitigation:
Exclude voided deliveries from active delivery totals and recent activity counts where appropriate.

### Risk 3: Low-balance customers are not surfaced

If customers with low balance are not listed, the owner loses a key operational cue.

Mitigation:
Include a dedicated low-balance customer panel with sorted results.

### Risk 4: The dashboard becomes too complex

If too many metrics are added, the page stops being a simple owner tool.

Mitigation:
Keep the dashboard focused on a small set of high-value metrics and recent activity.

### Risk 5: Dashboard data becomes stale

If the dashboard does not rely on current ledger values, it may lag behind real activity.

Mitigation:
Calculate metrics directly from the database on each request.

## Priority

Priority: High

This story is high priority because it gives the owner a usable operational summary of the membership program. After the core transaction stories, a dashboard is the quickest way to make the system feel manageable in daily use.

## Success Metrics

The story is successful when the owner can open the dashboard and quickly understand the state of the membership business.

Business-capability success metrics:

- the owner can see the main ledger totals at a glance
- low-balance customers are easy to spot
- recent deliveries are easy to review
- the owner can navigate from the dashboard to the relevant customer records

Quality metrics:

- dashboard totals match the underlying ledger
- voided deliveries are handled correctly in the totals
- the dashboard remains fast and readable

Delivered evidence in the current application includes:

- `models/dashboard.js`
- `routes/admin.js`
- dashboard-related checks in `tests/phase1-owner.test.js`
- end-to-end verification in `tests/e2e-owner-customer-flow.test.js`

## Success Criteria Traceability To Delivered Application

The completed application confirms that Story 6.1 was implemented as a compact operational dashboard.

Implemented evidence includes:

- dashboard metrics for customers, outstanding cups, revenue, delivered cups, and bonus cups
- low-balance customer panel
- recent deliveries panel
- owner-authenticated route protection
- automated tests that verify the key totals and dashboard content

The current application therefore confirms that this story is the owner dashboard foundation for the Phase 1 MVP.
