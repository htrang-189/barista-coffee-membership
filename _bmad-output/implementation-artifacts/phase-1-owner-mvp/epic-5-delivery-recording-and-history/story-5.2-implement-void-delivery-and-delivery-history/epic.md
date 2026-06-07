# Story 5.2: Implement Void Delivery And Delivery History

Phase: Phase 1: Owner MVP

Epic: Epic 5: Delivery Recording And History

Output type: `epic.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 5.2 was to give the owner a correction mechanism for mistaken delivery entries while preserving the integrity of the prepaid cup ledger. In a real coffee shop, delivery records can be entered incorrectly because of counter pressure, miscounts, or accidental double-entry. The business needs a controlled way to reverse those mistakes without corrupting the customer’s balance.

The delivered application shows that the correct business framing for this story is not just “delete a row.” It is a managed void operation that restores the customer balance and preserves the original delivery record for auditability. That distinction matters because prepaid balances are operational truth, and the shop needs to correct errors without losing traceability.

## Epic Objective

Epic 5: Delivery Recording And History exists to make cup consumption a trustworthy ledger, not just a one-way subtraction flow. Story 5.1 established delivery recording and balance protection. Story 5.2 completes the correction side of the ledger by allowing an owner to void a mistaken delivery and by exposing delivery history in a way that can be reviewed operationally.

The epic objective for this story is to:

- provide a safe void path for erroneous delivery records
- restore the customer balance when a delivery is voided
- preserve the original delivery record for historical traceability
- expose delivery history to the owner in the admin portal

This story turns delivery recording from a write-only action into a reviewable and correctable ledger process.

## Story Objective

The objective of Story 5.2 was to implement delivery correction and delivery history review so the owner can inspect prior deliveries, identify mistakes, and void an incorrect record without breaking the balance model.

Using the delivered application as the source of truth, this means:

- showing delivery history by customer
- showing recent delivery activity in the admin portal
- allowing the owner to void a delivery record
- restoring cups to the customer balance when voided
- preventing a delivery from being voided twice

## User Value

The primary user is the coffee shop owner.

The owner gains confidence that delivery mistakes can be corrected cleanly. If an entry is wrong, the owner can void it instead of manually editing balances or creating a separate adjustment process. That reduces operational risk and makes the system easier to use during a busy shift.

The customer also benefits indirectly because the balance they see remains trustworthy. If the owner corrects a mistake, the system restores the balance rather than leaving the account inconsistent.

At the product level, delivery history adds traceability. The shop can review what happened, when it happened, and who performed the action. That is important for accountability in a prepaid membership ledger.

## Acceptance Criteria

1. The owner can view delivery history for a customer.
2. The owner can view recent delivery activity in the admin portal.
3. The owner can void a delivery record.
4. Voiding a delivery restores the delivered cups to the customer balance.
5. A delivery cannot be voided more than once.
6. Delivery history preserves the original delivery record after voiding.
7. The application records who voided the delivery.
8. Delivery history is shown in a clear newest-first order.
9. Delivery void actions are protected by owner authentication and CSRF.
10. Automated tests cover delivery voiding and history display behavior.

## Dependencies

Story 5.2 depends on the delivery ledger and the existing admin portal.

Prerequisite dependencies:

- Story 1.1: Build Local Express And SQLite Foundation
- Story 1.2: Establish Configuration, Data Access, And Test Foundation
- Story 2.1: Implement Owner Authentication And Route Protection
- Story 3.1: Implement Customer Account Management
- Story 3.2: Add Customer Search, Detail, And Validation Coverage
- Story 4.1: Implement Package Purchase, Fixed Pricing, And Bonus Crediting
- Story 4.2: Add Package Purchase History And Tests
- Story 5.1: Implement Multi-Cup Delivery And Balance Protection

Technical dependencies:

- `models/delivery-history.js`
- `voidDelivery(...)`
- `listDeliveriesForCustomer(...)`
- `listRecentDeliveries(...)`
- `delivery_history` table with void columns
- `customer_accounts.current_balance`
- owner-authenticated admin routes

Downstream dependencies:

- delivery test coverage
- customer portal history display
- dashboard recent activity
- balance warning and status UI

## Risks

### Risk 1: Mistaken delivery entries cannot be corrected

If the owner cannot void a bad delivery, the ledger must be manually patched or left incorrect.

Mitigation:
Provide a controlled void action that restores the balance and records the correction.

### Risk 2: Voiding could permanently erase the original event

If the correction process deletes the delivery record, the system loses auditability.

Mitigation:
Mark the record voided instead of deleting it so history remains intact.

### Risk 3: A delivery could be voided twice

If a voided record can be voided again, the balance could be inflated incorrectly.

Mitigation:
Check void status before applying the restoration and block repeated voids.

### Risk 4: Delivery history is not visible enough for operational review

If the owner cannot see past deliveries easily, correction becomes harder than it should be.

Mitigation:
Render customer-specific delivery history and a recent admin deliveries view.

### Risk 5: Void operations change balance without traceability

If the application restores cups but does not record who performed the action, audit confidence is reduced.

Mitigation:
Store the voiding admin user and log the action in the admin audit trail.

## Priority

Priority: High

This story is high priority because ledger correction is part of making the delivery system safe in production. A delivery system without a void path is fragile, especially when the owner uses it every day under time pressure.

## Success Metrics

The story is successful when the owner can inspect and correct delivery history without corrupting the balance.

Business-capability success metrics:

- the owner can view delivery history for a customer
- the owner can void a mistaken delivery
- the customer balance is restored correctly after voiding
- repeated void attempts are blocked

Data-quality success metrics:

- voided deliveries remain visible in the ledger
- the voiding admin is stored and traceable
- the balance after void matches the expected restored amount

Delivered evidence in the current application includes:

- `models/delivery-history.js`
- `routes/admin.js`
- delivery history sections on the customer detail and admin delivery pages
- delivery-related checks in `tests/phase1-owner.test.js`
- broader owner/customer flow coverage in `tests/e2e-owner-customer-flow.test.js`

## Success Criteria Traceability To Delivered Application

The completed application shows that this story was correctly framed as a void-and-history capability.

Implemented evidence:

- `models/delivery-history.js`
  - `voidDelivery(...)`
  - `listDeliveriesForCustomer(...)`
  - `listRecentDeliveries(...)`
  - `findDeliveryById(...)`
- `routes/admin.js`
  - delivery history rendering
  - void route handling
  - admin deliveries list
- `tests/phase1-owner.test.js`
  - void delivery restores balance
  - voided delivery cannot be voided again
  - delivery history remains newest-first
- `tests/e2e-owner-customer-flow.test.js`
  - delivery record can be voided in a real owner flow
  - restored balance can be observed after correction

The current application therefore confirms that Story 5.2 is the ledger correction and history review complement to the multi-cup delivery workflow established in Story 5.1.
