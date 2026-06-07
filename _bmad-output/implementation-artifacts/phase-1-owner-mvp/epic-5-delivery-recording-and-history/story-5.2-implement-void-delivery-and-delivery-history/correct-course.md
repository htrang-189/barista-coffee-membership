# Story 5.2: Implement Void Delivery And Delivery History

Phase: Phase 1: Owner MVP

Epic: Epic 5: Delivery Recording And History

Output type: `Updated Plan`

Status: Reconstructed retrospective change-control artifact

## Correct-Course Purpose

This artifact documents the difference between the original delivery-correction assumption and the delivered solution. Story 5.2 started as a “delivery history” concept, but the completed application shows that the correct interpretation was a void-and-history ledger correction workflow.

## Original Assumption

The original assumption was too shallow: delivery history might have been treated as a read-only list, and correction might have been imagined as a simple delete or edit action.

That assumption would have been unsafe for a prepaid membership system because the delivery ledger is the source of truth for customer balance changes. If a record can be deleted or directly edited without traceability, the ledger loses audit value and becomes harder to trust.

## Issue Or Change Trigger

The key trigger for correction was the realization that delivery mistakes must be reversible without removing the original event. In a real coffee shop, the owner needs to fix counter mistakes quickly, but the system still needs to preserve what originally happened.

This means the story needed to support correction, not deletion.

## Problem Discovered

Two problems emerged from the original assumption:

1. a plain history list is not enough when the owner needs to correct mistakes
2. deleting or editing the original delivery would break auditability and could corrupt balance history

Without a void concept, the ledger would not be operationally safe.

## Root Cause

The root cause was an incomplete definition of what “delivery history” means in a prepaid ledger.

The application needs the history not only to show past activity, but also to support correction while preserving the original event. That requires void metadata, balance restoration, and repeat-void protection. Those needs were not part of the simpler assumption.

## Decision Taken

The plan was updated so that delivery correction is implemented as a void operation that:

- preserves the original delivery row
- restores the customer balance
- stores void metadata
- blocks repeated voids
- keeps history visible after correction

The history view is part of the same story because the owner must be able to see the ledger in context before voiding.

## Business Rationale

The business needs a correction workflow that matches real shop operations.

The owner will make mistakes. When that happens, the app must allow the mistake to be corrected immediately without introducing another manual process. The void approach gives the owner confidence while keeping the customer’s balance trustworthy.

## Technical Rationale

The delivered application confirms that the correction pattern belongs in the model layer as a transactional ledger operation.

Voiding is not a UI action; it is a data integrity action. The model must restore the balance and mark the delivery voided in one transaction, and the route layer must simply expose that action with proper admin and CSRF protection.

## Updated Implementation Plan

The revised implementation plan became:

1. expose delivery history for each customer
2. expose recent deliveries in the admin portal
3. add a void action for active delivery records
4. restore cups to the customer balance when voided
5. preserve the original delivery record with void metadata
6. block repeated void attempts
7. write tests around the correction workflow

## Impact On Architecture

The corrected plan strengthened the existing architecture.

It reinforced the model-first pattern used across the app and kept balance-changing operations server-side and transactional. It also ensured the admin portal remained the operational control surface, which is appropriate for a correction workflow.

## Impact On Future Stories

This adjustment improves the foundation for later stories.

Any future customer portal history, dashboard metrics, or reporting features can rely on void metadata and preserved history rather than needing special-case cleanup logic. That makes the rest of the product safer to extend.

## Impact On UI

The UI impact is that delivery history needed to be visible in two places:

- the customer-specific admin detail page
- the global admin delivery list

The void action also needed to be clearly visible for active records but not for already voided entries.

## Impact On Data / Logic

The data model needed to support:

- voided_at
- voided_by_admin_id
- preserved delivered_cups
- restored balance after void

The logic needed to:

- reject repeated voids
- record who performed the correction
- keep the original event intact

## Impact On Testing

The test plan became more specific and more ledger-focused.

Instead of only checking that history displays, the plan had to verify:

- a void restores the customer balance
- a voided delivery cannot be voided again
- delivery history remains visible after correction
- the owner can execute the flow in the real admin portal

## Lessons From The Adjustment

1. Delivery history in a prepaid system must support correction, not just review.
2. Preserving the original record is more valuable than deleting it.
3. Void metadata is essential for trust and traceability.
4. Balance restoration must be transactional or the ledger becomes unreliable.
5. Admin-facing correction workflows should remain explicit and protected.

## Final Outcome

The delivered implementation is the corrected plan:

- delivery history is visible
- mistaken deliveries can be voided
- balances are restored safely
- the original record remains auditable
- repeated voids are blocked

That is the correct interpretation of Story 5.2 in the final application.
