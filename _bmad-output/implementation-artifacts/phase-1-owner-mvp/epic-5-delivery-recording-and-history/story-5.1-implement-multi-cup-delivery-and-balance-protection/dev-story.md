# Story 5.1: Implement Multi-Cup Delivery And Balance Protection

Phase: Phase 1: Owner MVP

Epic: Epic 5: Delivery Recording And History

Output type: `CODE`

Status: Reconstructed retrospective implementation evidence

## Development Objective

Implement the delivery-side ledger workflow for the Barista Coffee Membership product so the owner can record one or more cups consumed by a customer, prevent impossible deliveries, and keep the prepaid balance synchronized with delivery history.

## Implementation Summary

The delivered application implements Story 5.1 as a transactional delivery ledger on top of the existing customer balance model. The owner can record a delivery of one or more cups against a customer account, the system rejects invalid quantities and impossible deliveries, and the resulting balance is persisted together with the delivery record.

This story is not a visual-only change. Its core value is data integrity. The application must never let the ledger drift, because the prepaid balance is the operational truth that drives later customer-facing history, low-balance messaging, dashboard metrics, and void/reversal workflows.

The final implementation is split across three layers:

- the delivery model handles validation and database transactions
- the admin routes expose the owner workflow
- the tests verify the business rules that protect the ledger

## Files Created

### `models/delivery-history.js`

This file exists because delivery recording needs a dedicated domain model, just as package purchases do.

It solves the problem of scattering balance subtraction and history writing across the route layer. By placing the logic in a model, the application keeps the business rule in one place and makes it testable without browser interaction.

How it works:

- normalizes delivered cups to a positive whole number
- loads the customer balance before writing
- blocks zero-balance and over-balance delivery attempts
- updates the customer balance and inserts the delivery history within one transaction
- records an audit entry in `admin_action_logs`
- supports later voiding and delivery history listing

The model exports:

- `normalizeDeliveredCups(...)`
- `recordDelivery(...)`
- `voidDelivery(...)`
- `listDeliveriesForCustomer(...)`
- `listRecentDeliveries(...)`
- `findDeliveryById(...)`

## Files Modified

### `routes/admin.js`

This route file was modified because the owner-facing delivery workflow belongs in the admin portal.

It solves the problem of having no place for the owner to submit delivery quantities or review the resulting history. The admin portal is the correct operational surface because only the owner should adjust prepaid consumption.

How it works:

- exposes the delivery submission route for a customer
- renders delivery history on the customer detail page
- renders the admin deliveries list with pagination
- shows success and error messaging for delivery operations
- handles voiding of a delivery record

Key route behavior implemented here:

- `POST /admin/customers/:customerId/deliveries`
- `GET /admin/customers/:customerId/deliveries`
- `GET /admin/deliveries`
- `POST /admin/deliveries/:deliveryId/void`

### `tests/phase1-owner.test.js`

This test file was extended to cover delivery recording, over-balance rejection, zero-balance rejection, newest-first history ordering, and voiding behavior.

It solves the problem of delivery logic being high-risk and easy to regress. A single mistake in quantity validation or transaction logic would break the ledger.

How it works:

- creates a customer and seeds purchase balance
- verifies blocked delivery when balance is zero
- verifies blocked delivery when quantity exceeds balance
- verifies valid multi-cup delivery updates balance
- verifies delivery history ordering
- verifies voiding restores the balance

### `tests/e2e-owner-customer-flow.test.js`

This end-to-end test file was expanded to prove delivery actions work in a realistic owner session and that the resulting delivery record can be observed in the ledger.

It solves the problem of unit-level correctness not being enough to prove the owner workflow survives the full route and session stack.

How it works:

- logs in as the owner
- creates or loads a customer
- submits a delivery through the admin route
- verifies the delivered cups are stored and the balance changes accordingly
- verifies void state in the ledger

## Database Changes

### `delivery_history` table usage

This story relies on the delivery history table as a permanent ledger event store.

Why it exists:

The business needs an auditable record of every cup consumption event. A current balance alone is not enough because the owner must be able to review how the balance changed over time.

What problem it solves:

It preserves traceability for each delivery and supports later history review and voiding.

How it works:

- stores `customer_id`
- stores `delivered_cups`
- stores `balance_after`
- stores `note`
- stores `created_by_admin_id`
- stores `delivery_date`
- stores void metadata when needed

### `customer_accounts.current_balance`

This existing column is updated transactionally when delivery is recorded.

Why it exists:

The customer balance is the live operational value used by the admin portal and the customer portal.

What problem it solves:

It prevents the application from relying only on history rows to know the current prepaid balance.

How it works:

- the model calculates the remaining balance after the delivery
- the balance is updated in the same transaction as the delivery insert

## Routes Added

### `POST /admin/customers/:customerId/deliveries`

Why it exists:

The owner needs a direct submission path for recording cup consumption against a specific customer.

What problem it solves:

It turns the delivery workflow into an actual transactional action rather than a static view.

How it works:

- validates the request under owner authentication
- normalizes the cup quantity
- rejects invalid or impossible delivery attempts
- writes the delivery record and updates balance together
- redirects back to the customer page with a success or error indicator

### `GET /admin/customers/:customerId/deliveries`

Why it exists:

The owner needs a full delivery history view for review and auditing.

What problem it solves:

It keeps the ledger inspectable after the delivery is recorded.

How it works:

- loads customer-specific delivery rows
- renders them in newest-first order
- exposes void controls for non-voided records

### `GET /admin/deliveries`

Why it exists:

The owner needs a global delivery list to review recent activity across customers.

What problem it solves:

It gives the admin a centralized view of consumption activity and pagination.

How it works:

- loads recent deliveries across customers
- paginates the list
- exposes newer/older navigation

### `POST /admin/deliveries/:deliveryId/void`

Why it exists:

The owner needs a controlled correction path for mistaken delivery entries.

What problem it solves:

It allows bad entries to be reversed while restoring the customer balance.

How it works:

- validates owner authentication and CSRF
- voids the delivery record
- restores the cups to the customer balance
- writes an audit log entry

## Models Added

### `models/delivery-history.js`

This model is the main business logic surface for Story 5.1.

Why it exists:

Delivery is a ledger operation with more than one database write and more than one validation rule. That is a model concern, not a route concern.

What problem it solves:

It centralizes the rules around delivery quantity, available balance, immutable history, and voiding.

How it works:

- `normalizeDeliveredCups(...)` enforces positive whole numbers
- `recordDelivery(...)` checks balance and writes the transaction
- `voidDelivery(...)` restores the balance and marks the record voided
- `listDeliveriesForCustomer(...)` returns the customer-specific history
- `listRecentDeliveries(...)` powers the admin list and dashboard usage

## UI Components Added

### Delivery entry form in the admin customer detail view

Why it exists:

The owner needs a simple way to record the delivered cup quantity from the customer detail page.

What problem it solves:

It eliminates the need for a separate operational system just to subtract cups from a balance.

How it works:

- accepts a positive quantity input
- submits to the delivery record route
- displays inline feedback for invalid or blocked deliveries

### Delivery history section

Why it exists:

The owner needs confirmation of what was delivered and what remains.

What problem it solves:

It provides traceability without forcing the owner into a separate reporting screen.

How it works:

- renders newest-first delivery items
- shows quantity, note, timestamp, and balance-after
- shows void state when applicable

### Admin deliveries list

Why it exists:

The owner needs a global operational view of all delivery activity.

What problem it solves:

It supports review and troubleshooting without requiring search through individual customers.

How it works:

- paginates recent deliveries
- provides older/newer navigation
- includes void controls for active records

## Business Logic Implemented

The delivered implementation enforces the following business rules:

- delivered quantity must be a positive whole number
- delivery is blocked when the balance is zero
- delivery is blocked when requested cups exceed the current balance
- delivery and balance update happen atomically
- balance-after is stored with the delivery record
- voiding a delivery restores the cups to the customer balance

Why this logic exists:

It protects the prepaid ledger from invalid state and preserves trust in the membership balance.

What problem it solves:

It prevents underflow, over-consumption, and ledger drift.

How it works:

- checks the customer balance before applying the update
- calculates the remaining balance in memory
- writes the balance update and history insert inside a transaction
- records audit logs for operational traceability

## Validation Rules

The implementation validates:

- the delivered cup count must be numeric
- the delivered cup count must be an integer
- the delivered cup count must be greater than zero
- the delivery quantity must not exceed the current balance
- the customer must exist before the transaction proceeds

These rules exist to keep the ledger consistent and to stop invalid user input before it reaches the database.

## Security Controls

Delivery actions are protected by the existing owner authentication and CSRF controls.

Why this exists:

Delivery directly changes customer balance, so only the authenticated owner should be able to perform it.

What problem it solves:

It prevents unauthorized consumption changes and forged requests.

How it works:

- `requireAdmin` guards admin routes
- `requireCsrfToken` protects the POST actions
- audit logging records who created or voided the delivery

## Test Coverage

The implementation is covered by both route-level and model-level tests.

### Model coverage

- blocked when balance is zero
- blocked when quantity exceeds balance
- valid multi-cup delivery updates the balance correctly
- delivery history returns newest-first records
- voiding restores the balance

### Route coverage

- delivery submission route returns expected success/error outcomes
- admin deliveries page renders and paginates
- void action is available for active deliveries

### End-to-end coverage

- the owner can record a multi-cup delivery in a real logged-in flow
- the customer ledger reflects the transaction
- void state is observable after correction

## How This Supports The User Workflow

This story supports the owner workflow by turning the prepaid balance into something the shop can actually consume during service.

The owner starts on the customer detail page, enters the number of cups delivered, and saves the delivery. The application immediately validates the amount, updates the balance if the request is valid, and stores the event in history. If the request is invalid, the owner gets a direct error and the balance is untouched.

That workflow matters because it mirrors how a real coffee shop operates: fast entry, immediate balance update, and an auditable ledger behind the scenes.

## Delivered Output

The delivered output for Story 5.1 is a working owner delivery ledger that supports:

- multi-cup delivery recording
- strict balance protection
- transactional balance subtraction
- delivery history review
- void/correction support

The current application demonstrates that the story was implemented as a robust operational ledger feature, not as a simple UI add-on.

## Evidence From Current Web App

Relevant delivered files include:

- `models/delivery-history.js`
- `routes/admin.js`
- `tests/phase1-owner.test.js`
- `tests/e2e-owner-customer-flow.test.js`

The current application confirms the intended scope:

- delivery quantities are normalized and validated
- zero-balance and over-balance deliveries are blocked
- delivery history is stored and rendered newest-first
- voiding restores the balance
- admin-only controls protect the workflow
