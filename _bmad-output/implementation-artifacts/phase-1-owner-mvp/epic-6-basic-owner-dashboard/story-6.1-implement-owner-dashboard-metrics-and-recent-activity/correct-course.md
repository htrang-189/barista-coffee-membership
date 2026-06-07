# Story 6.1: Implement Owner Dashboard Metrics And Recent Activity

Phase: Phase 1: Owner MVP

Epic: Epic 6: Basic Owner Dashboard

Output type: `Updated Plan`

Status: Reconstructed retrospective change-control artifact

## Correct-Course Purpose

This artifact documents how the original dashboard assumption changed before implementation. Story 6.1 began as a generic owner summary concept, but the delivered application shows that the correct plan was a live operational dashboard built from the ledger tables.

## Original Assumption

The initial assumption could have been that the owner dashboard was just a simple landing page with a few counts or a decorative overview panel. That would have been too weak for a real membership business because the owner needs trustworthy, current data rather than a static summary.

The delivered application proves that the dashboard needed to be tied directly to the live business ledger.

## Issue Or Change Trigger

The trigger for correction was the realization that the owner dashboard is only useful if it reflects the actual state of the system.

If the dashboard shows stale counts, ignores voided deliveries, or hides low-balance customers, it stops being a useful operational tool. The plan therefore had to become more explicit about live aggregation and recent activity.

## Problem Discovered

The original assumption was too vague in several ways:

1. it did not clearly define which metrics mattered
2. it did not ensure the dashboard would use live ledger data
3. it did not explicitly handle voided deliveries in the totals
4. it did not specify the low-balance and recent-activity panels as core owner cues

Without correction, the dashboard could have become too generic or misleading.

## Root Cause

The root cause was treating the dashboard as a cosmetic page rather than a ledger-backed operational tool.

For the dashboard to be useful, it must summarize the business state accurately and immediately. That requires direct aggregation from the data already recorded by the package, delivery, and customer flows.

## Decision Taken

The plan was updated to make the dashboard a live summary of the owner MVP ledger.

The final dashboard needed to:

- show meaningful operational metrics
- compute values directly from the database
- exclude voided deliveries from active totals
- surface low-balance customers
- show recent deliveries linked back to customers

## Business Rationale

The shop owner needs a fast way to understand the health of the membership program.

The corrected dashboard provides a practical at-a-glance view that answers the owner’s daily questions without requiring them to drill into individual records. That supports actual shop operations better than a generic overview screen.

## Technical Rationale

The completed application shows that the right implementation is a model-backed aggregation layer plus a server-rendered admin dashboard.

This approach keeps the dashboard consistent with the rest of the codebase, avoids duplicate summary storage, and ensures the numbers always come from the current ledger state.

## Updated Implementation Plan

The revised implementation plan became:

1. build a dashboard model that calculates live metrics from the ledger tables
2. render those metrics in the admin dashboard route
3. include low-balance customers and recent deliveries as operational panels
4. exclude voided deliveries from active totals
5. link recent activity back to customer records
6. protect the route with owner authentication
7. add tests that validate the summary data

## Impact On Architecture

The architecture became more disciplined.

The dashboard is now clearly a read-only aggregation layer over the existing ledger. That preserves the model-first design of the application and avoids introducing a parallel reporting store.

## Impact On Future Stories

This correction sets the right baseline for later reporting or summary features.

Future stories can build on the live dashboard pattern rather than inventing their own summary logic. That keeps the application consistent and makes later features easier to verify.

## Impact On UI

The UI needed to stay operational and concise.

The dashboard should not feel like a reporting suite. It should feel like a working shop tool with a few important numbers, a low-balance table, and recent activity.

## Impact On Data / Logic

The correction clarified that dashboard values must come directly from:

- customer accounts for balances and customer count
- package purchases for revenue and bonus cups
- delivery history for active consumption and recent activity

It also clarified that voided deliveries must be excluded from active totals.

## Impact On Testing

The dashboard plan now requires tests that validate:

- metrics match the live ledger
- low-balance customers are listed
- recent deliveries are shown correctly
- voided deliveries do not inflate totals
- owner authentication still protects the route

## Lessons From The Adjustment

1. A dashboard is only useful if its numbers are current and trustworthy.
2. Live aggregation is better than cached summaries for a small operational MVP.
3. Voided transactions must be respected in every summary view.
4. Low-balance and recent-activity panels are more valuable than decorative reporting widgets.
5. The owner dashboard should be practical, not analytical.

## Final Outcome

The delivered implementation reflects the corrected plan:

- live metrics from the ledger
- low-balance customer visibility
- recent delivery activity
- owner-only access
- tests that verify the summary values

That is the correct final interpretation of Story 6.1 in the completed application.
