# Story 6.2: Add Dashboard Tests

Phase: Phase 1: Owner MVP

Epic: Epic 6: Basic Owner Dashboard

Output type: `Updated Plan`

Status: Reconstructed retrospective change-control artifact

## Correct-Course Purpose

This artifact documents how the original dashboard testing assumption changed before implementation. Story 6.2 started as a general test-coverage task, but the completed application shows that the correct plan was to protect the live dashboard summary with void-aware regression tests.

## Original Assumption

The original assumption could have been that the story would add a handful of basic tests for the dashboard page. That would have been too vague and too weak for a summary view that the owner uses to judge the state of the business.

The delivered application shows that the dashboard tests needed to verify live ledger totals, low-balance visibility, recent activity, and access protection.

## Issue Or Change Trigger

The change trigger was the realization that the dashboard is only trustworthy if it accurately reflects the underlying ledger. A simple page-rendering test would not catch the kinds of regressions that matter most.

The dashboard depends on package purchases, deliveries, voids, and customer balances. That means the test story had to be more specific than “check the page loads.”

## Problem Discovered

The original assumption risked under-scoping the test work in three ways:

1. it could have focused only on surface rendering
2. it could have ignored void-aware totals
3. it could have missed low-balance and recent-activity regressions

Those gaps would leave the owner dashboard vulnerable to silent data drift.

## Root Cause

The root cause was treating the dashboard tests as UI coverage instead of ledger protection.

The owner dashboard is not just a page. It is a live business summary. That means the test plan must validate the business totals and the operational cues, not only the DOM structure.

## Decision Taken

The plan was updated to treat the dashboard tests as regression coverage for the summary layer.

The final plan explicitly verifies:

- customer count
- outstanding cups
- recorded revenue
- delivered cups
- bonus cups
- low-balance customer visibility
- recent delivery visibility
- owner-only access
- void-aware accuracy

## Business Rationale

The owner dashboard influences real operational decisions.

If the metrics are wrong, the shop could miss low-balance customers or misunderstand business activity. The corrected testing plan protects that business value by verifying the numbers against seeded ledger data.

## Technical Rationale

The completed application shows that the dashboard is calculated directly from the live database.

That means the tests must also operate against real SQLite data and real route rendering. The correct approach is to seed the ledger, calculate the expected values, and assert the dashboard reflects them.

## Updated Implementation Plan

The revised implementation plan became:

1. seed the ledger with known customers, purchases, deliveries, and voids
2. verify the dashboard metric totals against expected values
3. verify low-balance customers appear correctly
4. verify recent deliveries appear and link back to customers
5. verify the dashboard route remains owner-protected
6. verify voided deliveries do not inflate delivery totals
7. extend the end-to-end owner flow to prove dashboard consistency after correction

## Impact On Architecture

The architecture was reinforced rather than changed.

The tests continue to exercise the real dashboard model and the real admin route. That keeps the application’s model-first design intact and avoids fake summary data or test-only abstractions.

## Impact On Future Stories

This correction creates a safer baseline for future dashboard or reporting work.

If later stories add more summary fields, charting, or reporting, the tests can be extended from this void-aware baseline rather than having to replace a vague or weak suite.

## Impact On UI

The correction clarified that the UI matters in terms of information hierarchy, not just rendering.

The dashboard must continue to show:

- metric cards
- low-balance customers
- recent deliveries

The tests now validate those operational sections as part of the business contract.

## Impact On Data / Logic

The corrected plan made it explicit that dashboard tests must respect the underlying data rules:

- live aggregates come from the ledger tables
- voided deliveries must be excluded from active counts
- low-balance customers are derived from current balances
- recent activity is sourced from the most recent delivery data

## Impact On Testing

The testing plan changed from basic page checks to business-rule regression coverage.

The suite now needs to prove:

- metrics are accurate
- voids are handled correctly
- owner access remains protected
- recent activity links are valid

## Lessons From The Adjustment

1. Dashboard tests must validate business totals, not just page presence.
2. Void awareness is essential for any summary view built on a ledger.
3. Low-balance and recent-activity panels are part of the owner’s operational workflow, so they deserve explicit assertions.
4. Live database-backed tests are the right fit for a read-only summary view.
5. A dashboard test story should be framed as regression protection for business trust, not as generic UI coverage.

## Final Outcome

The delivered implementation reflects the corrected plan:

- dashboard totals are tested against live ledger data
- low-balance customers and recent deliveries are covered
- owner access is tested
- void-aware behavior is verified

That is the correct final interpretation of Story 6.2 in the completed application.
