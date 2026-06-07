# Story 6.1: Implement Owner Dashboard Metrics And Recent Activity

Phase: Phase 1: Owner MVP

Epic: Epic 6: Basic Owner Dashboard

Output type: `story-[slug].md`

Status: Reconstructed retrospective implementation story

## Story Title

Implement Owner Dashboard Metrics And Recent Activity

## Business Context

The Barista Coffee Membership application already supports customer accounts, package purchases, delivery recording, voiding, and customer-facing balance access. Once those operational capabilities exist, the owner still needs a concise way to understand the state of the business without drilling into individual customer records.

Story 6.1 exists to provide that operational summary. The completed application shows that the correct dashboard is not a generic analytics tool. It is a compact owner dashboard that answers the practical questions the shop owner needs every day:

- how many customers exist
- how many cups are still outstanding
- how much package revenue has been recorded
- how many cups have been delivered
- how many bonus cups have been granted
- which customers are low on balance
- what recent deliveries happened most recently

That makes the owner MVP feel complete and manageable.

## User Story

As the owner, I want to see dashboard metrics and recent activity so that I can monitor the membership business at a glance.

## Acceptance Criteria

1. The dashboard displays the total number of customers.
2. The dashboard displays the total outstanding cups across all customers.
3. The dashboard displays recorded package revenue in VND.
4. The dashboard displays total cups delivered.
5. The dashboard displays total bonus cups granted.
6. The dashboard lists customers with low balances.
7. The dashboard shows recent delivery activity.
8. The recent activity links back to the relevant customer record.
9. The dashboard is protected by owner authentication.
10. Automated tests verify the dashboard behavior.

## Functional Requirements

The application must calculate the total number of customer accounts from the live customer ledger.

The application must calculate total outstanding cups from the current balances stored on customer accounts.

The application must calculate recorded package revenue from package purchase records.

The application must calculate total cups delivered from active delivery records only.

The application must calculate total bonus cups granted from package purchase records.

The application must list customers whose balance is at or below the low-balance threshold.

The application must show recent delivery activity on the dashboard.

The application must link recent delivery activity to the associated customer detail page.

The application must keep the dashboard within the owner-only admin portal.

## Non-Functional Requirements

The dashboard must be read-only.

The dashboard must compute values from the live database so it stays current.

The dashboard must be fast enough for daily operational use.

The dashboard must remain concise and avoid unnecessary analytics complexity.

The dashboard must be maintainable and testable because it summarizes the core ledger behavior.

The dashboard must fit the existing server-rendered admin architecture and visual language.

## UI Requirements

The dashboard must present a compact set of summary metrics that the owner can read quickly.

The dashboard must display low-balance customers in a dedicated section.

The dashboard must display recent deliveries in a clearly visible activity panel.

The dashboard must allow the owner to click through to the relevant customer record from recent activity.

The dashboard should use the existing Barista admin styling and layout patterns.

The dashboard should remain focused on operational information rather than decorative reporting.

## Database Requirements

The dashboard must read from the existing customer_accounts table for balances and customer totals.

The dashboard must read from the package_purchases table for package revenue and bonus cups.

The dashboard must read from the delivery_history table for active delivery totals and recent activity.

Voided deliveries must be excluded from active delivery totals and recent activity calculations.

The dashboard must not require new schema changes to present the summary view.

## Technical Notes

The delivered application shows that dashboard behavior is implemented in a model helper and rendered in the admin route layer.

`models/dashboard.js` computes the metrics directly from the live ledger tables.

`routes/admin.js` renders the dashboard with metric cards, a low-balance customer table, and a recent deliveries panel.

The dashboard route is owner-protected and stays within the existing admin portal shell.

The dashboard uses the database as the source of truth on each request, which is the right design for a live operational summary.

## Testing Requirements

Tests must verify that the dashboard displays the total customer count.

Tests must verify that the dashboard displays total outstanding cups and recorded package revenue correctly.

Tests must verify that the dashboard displays total cups delivered and total bonus cups correctly.

Tests must verify that low-balance customers are shown.

Tests must verify that recent deliveries are shown and linked back to the correct customer records.

Tests must verify that the dashboard route remains owner-protected.

Tests should verify that voided deliveries do not inflate the active delivery totals.

## Definition Of Done

The story is done when the owner can open the dashboard and quickly understand the state of the membership business through accurate metrics and recent activity, and when automated tests prove the numbers and links are correct.

The story is not done if the metrics are stale, if voided deliveries are counted incorrectly, or if the dashboard is not protected by owner authentication.

## Expected Delivered Output

The expected delivered output is a working owner dashboard that includes:

- customer count
- outstanding cup count
- package revenue
- cups delivered
- bonus cups
- low-balance customer list
- recent delivery activity panel

The completed application confirms that Story 6.1 delivered the owner dashboard summary required for the Phase 1 MVP.
