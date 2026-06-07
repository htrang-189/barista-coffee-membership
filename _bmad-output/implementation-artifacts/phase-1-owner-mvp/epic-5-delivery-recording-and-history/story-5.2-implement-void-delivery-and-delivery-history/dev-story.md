# Story 5.2: Implement Void Delivery And Delivery History

Phase: Phase 1: Owner MVP

Epic: Epic 5: Delivery Recording And History

Output type: `CODE`

Status: Reconstructed retrospective implementation evidence

## Development Objective

Implement the correction side of the delivery ledger so the owner can review delivery history, void mistaken deliveries, and restore customer balance without destroying the audit trail.

## Implementation Summary

The delivered application implements Story 5.2 as a model-backed void workflow and history review feature in the admin portal. Delivery records are preserved, not deleted. A void operation marks the record voided, restores the customer balance, and records who performed the correction. The owner can also review delivery history by customer and in the global admin deliveries view.

This story completes the operational ledger pattern started in Story 5.1. Delivery recording without correction would leave the prepaid system fragile. The void-and-history implementation closes that gap.

## Files Created

### `models/delivery-history.js`

This file is the core business logic implementation for delivery correction and history review.

Why it exists:

Delivery correction involves database reads, balance restoration, void state checks, and audit logging. That is a domain responsibility and belongs in a model module rather than in route handlers.

What problem it solves:

It centralizes the rules that prevent repeated voids, restore balances correctly, and preserve the original record as history.

How it works:

- loads delivery records by id
- checks whether the delivery has already been voided
- loads the associated customer balance
- restores cups back to the customer balance
- marks the delivery record voided with metadata
- writes an admin action log for traceability
- returns customer and balance details to the route layer

The model exports:

- `findDeliveryById(...)`
- `voidDelivery(...)`
- `listDeliveriesForCustomer(...)`
- `listRecentDeliveries(...)`
- helper read wrappers for SQLite access

## Files Modified

### `routes/admin.js`

This route file was modified because the void and history workflow belongs inside the owner-facing admin portal.

Why it exists:

The owner needs a place to inspect delivery activity, void a bad record, and see the resulting balance update.

What problem it solves:

It turns the delivery ledger into an operational screen rather than a hidden database feature.

How it works:

- renders customer-specific delivery history
- renders the admin-wide recent deliveries list
- exposes a POST route to void a delivery
- shows success and error states for voiding
- preserves the delivery history on the customer detail page

Relevant routes implemented here:

- `GET /admin/customers/:customerId/deliveries`
- `POST /admin/deliveries/:deliveryId/void`
- `GET /admin/deliveries`
- delivery history rendering within `GET /admin/customers/:customerId`

### `tests/phase1-owner.test.js`

This test file was extended to cover the history and void paths.

Why it exists:

Voiding changes balance data and is high-risk. The logic must be covered by automated tests.

What problem it solves:

It prevents regressions in the ledger correction behavior.

How it works:

- records deliveries
- voids a delivery
- verifies balance restoration
- verifies repeated void attempts are rejected
- verifies the newest-first delivery order
- verifies the admin deliveries list is paginated and operational

### `tests/e2e-owner-customer-flow.test.js`

This end-to-end test file exercises the full owner path from delivery recording through voiding and customer-facing balance verification.

Why it exists:

The feature should not be considered complete unless it works in the actual authenticated workflow.

What problem it solves:

It catches integration issues that unit tests can miss, especially around route rendering and CSRF-protected actions.

How it works:

- signs in as the owner
- records a delivery
- voids the delivery
- verifies the customer balance is restored
- verifies the ledger still retains the original delivery row with void metadata

## Database Changes

### `delivery_history` table void metadata

This story uses the delivery history table as an immutable ledger with correction metadata.

Why it exists:

The shop needs to preserve the original delivery event while also marking that the event was corrected.

What problem it solves:

It avoids deleting audit history while still allowing the prepaid balance to be restored.

How it works:

- stores `voided_at`
- stores `voided_by_admin_id`
- keeps the original delivered cups and balance-after values intact

### `customer_accounts.current_balance`

The current balance is updated when a delivery is voided.

Why it exists:

The live prepaid balance must reflect the correction immediately.

What problem it solves:

It keeps the balance displayed in the admin and customer portals consistent with the corrected ledger.

How it works:

- reads the customer’s current balance
- adds back the voided cups
- updates the balance in the same transaction as the void operation

### `admin_action_logs`

The void workflow writes an audit log entry.

Why it exists:

Balance changes need accountability.

What problem it solves:

It preserves who performed the correction and what changed.

How it works:

- records a `delivery_voided` action
- stores the target delivery id
- stores a human-readable message about the correction

## Routes Added

### `POST /admin/deliveries/:deliveryId/void`

Why it exists:

The owner needs a secure, explicit action to correct a mistaken delivery.

What problem it solves:

It provides a controlled correction mechanism instead of database editing or deletion.

How it works:

- requires admin authentication
- requires CSRF protection
- calls the void model function
- redirects back to the customer page when successful
- blocks already-voided records

## Models Added

### `models/delivery-history.js`

This is the main new business model for Story 5.2.

Why it exists:

History review and delivery voiding are tightly coupled ledger operations.

What problem it solves:

It keeps the correction rules and queries in one place, which improves correctness and maintainability.

How it works:

- retrieves delivery records
- checks void state
- restores balances transactionally
- exposes customer-specific and global delivery lists

## UI Components Added

### Customer delivery history section

Why it exists:

The owner needs to inspect delivery history for a specific customer.

What problem it solves:

It makes corrections possible without leaving the customer context.

How it works:

- renders the delivery list newest first
- shows quantity, note, timestamp, and void state
- exposes void action for active deliveries

### Admin deliveries page

Why it exists:

The owner needs a global view of delivery activity.

What problem it solves:

It makes it easier to audit recent activity and find entries to correct.

How it works:

- shows recent deliveries across customers
- paginates the list
- includes void state in the table

### Void action button

Why it exists:

The correction workflow needs a visible action for active delivery records.

What problem it solves:

It avoids hidden or ambiguous correction behavior.

How it works:

- submits a CSRF-protected POST to the void route
- only appears for records that are not already voided

## Business Logic Implemented

The implementation enforces the following rules:

- a delivery can be voided only once
- voiding restores the cups to the customer balance
- the original delivery record remains in the database
- the void action stores who performed the correction
- history queries return newest-first data

Why this logic exists:

It preserves ledger trust while letting the owner correct mistakes.

What problem it solves:

It prevents repeated corrections from inflating balances and preserves auditability.

How it works:

- loads the delivery
- rejects missing or already-voided records
- loads the customer
- calculates the restored balance
- updates the balance and void state together
- records the audit log entry

## Validation Rules

The story validates:

- delivery id must point to an existing record
- delivery must not already be voided
- customer linked to the delivery must exist
- void actions must be owner-only and CSRF-protected

These rules exist because voiding is a balance-changing action and cannot be left open to invalid or repeated submission.

## Security Controls

The void and history workflows are protected by the same security controls as the rest of the owner portal.

Why this exists:

Void actions affect customer balances and must be restricted.

What problem it solves:

It prevents unauthorized or forged correction attempts.

How it works:

- owner authentication is required
- CSRF tokens are required for void submissions
- audit logging captures the acting admin

## Test Coverage

The delivered implementation is covered by both direct model tests and full workflow tests.

### Model-level coverage

- voiding restores the balance
- repeat void attempts are rejected
- delivery history returns newest-first

### Route and integration coverage

- the admin customer page shows delivery history
- the admin deliveries page shows recent activity
- voiding works through the actual admin workflow
- the customer balance reflects the correction after voiding

### End-to-end coverage

- the owner can record a delivery, void it, and see the restored balance in the same authenticated flow

## How This Supports The User Workflow

This story supports the owner workflow by making delivery mistakes recoverable.

The owner can inspect a customer’s delivery history, identify a bad entry, void it, and immediately restore the cups to the customer’s balance. That prevents manual database edits and keeps the app usable in real shop conditions.

The owner also gets a broader delivery history view in the admin portal, which helps with audit and operational review.

## Delivered Output

The delivered output for Story 5.2 is a working correction and history-review capability that includes:

- customer-specific delivery history
- admin-wide recent delivery review
- void delivery correction
- balance restoration
- audit logging
- repeat-void protection

## Evidence From Current Web App

Relevant delivered files include:

- `models/delivery-history.js`
- `routes/admin.js`
- `tests/phase1-owner.test.js`
- `tests/e2e-owner-customer-flow.test.js`

The current application shows the intended behavior clearly:

- delivery records remain visible after voiding
- balance is restored when a delivery is voided
- repeat voids are blocked
- the admin portal exposes both customer-specific and global delivery history
