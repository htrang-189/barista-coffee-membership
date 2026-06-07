# Story 5.1: Implement Multi-Cup Delivery And Balance Protection

Phase: Phase 1: Owner MVP

Epic: Epic 5: Delivery Recording And History

Output type: `epic.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 5.1 was to let the coffee shop owner record actual cup deliveries against a customer’s prepaid balance without breaking the ledger. A package purchase creates credit, but the membership program only becomes operational when the owner can consume that credit in real shop use. This story is where the balance moves from a stored number to a working cup count.

The delivery workflow matters because a prepaid membership is only trustworthy if the owner can record multiple cups at a time, reject impossible deliveries, and keep the balance accurate after each visit. A single-cup-only delivery model would be too limiting for real shop operations. The delivered application supports multi-cup delivery recording, blocks delivery when there is no balance, and prevents delivery quantities that exceed the current balance. That confirms the business need was correctly framed.

## Epic Objective

Epic 5: Delivery Recording And History exists to transform the package purchase ledger into a usable cup-consumption ledger. The epic objective is to allow the owner to record cup usage accurately, preserve the current balance after each delivery, and maintain a history that can later be reviewed and corrected when needed.

Within the epic, Story 5.1 covers the core operational delivery transaction:

- record one or more cups delivered at a time
- protect against zero-balance delivery attempts
- protect against over-delivery attempts
- keep the customer balance synchronized with the delivery record
- write the delivery as a permanent ledger event

This epic is the mirror image of the package purchase epic. Story 4.1 adds cups to the ledger; Story 5.1 removes them safely.

## Story Objective

The objective of Story 5.1 was to implement a delivery workflow that can handle multiple cups per visit and protect the customer balance from invalid delivery amounts.

Using the delivered application as the source of truth, this includes:

- multi-cup delivery quantity input
- positive whole-number validation for delivered cups
- blocking deliveries greater than the current balance
- blocking delivery when current balance is zero
- transactional subtraction from the customer balance
- delivery history records with balance-after values

This story gives the owner a practical and realistic way to record consumption in the prepaid ledger.

## User Value

The primary user is the coffee shop owner.

The owner gains a delivery workflow that matches how coffee actually moves in a small shop. Customers do not always redeem exactly one cup; they may use several cups in a single visit. The owner can now record that in one action without manual conversion or multiple entries. That saves time and reduces error during busy service periods.

There is also customer value. Customers benefit because their prepaid balance is consumed accurately and consistently. The current balance they see later reflects real visits instead of rough estimates or manual adjustments. That makes the membership program more trustworthy.

For the product overall, this story makes the prepaid ledger operational. A purchase ledger without delivery consumption is only half a system. This story closes that loop.

## Acceptance Criteria

1. The owner can record delivery of more than one cup at a time.
2. The delivery quantity accepts only positive whole numbers.
3. The application blocks delivery when the customer current balance is zero.
4. The application blocks delivery when the requested quantity is greater than the current balance.
5. The customer’s current balance is reduced by the delivered quantity when the delivery is valid.
6. Delivery history stores the delivered quantity and the resulting balance after the delivery.
7. The owner can view delivery history for a customer.
8. Delivery records are stored as permanent ledger events.
9. Delivery behavior is covered by automated tests.
10. Invalid delivery attempts do not corrupt the customer balance.

## Dependencies

Story 5.1 depended on earlier Phase 1 work and the already-delivered package purchase ledger.

Prerequisite dependencies:

- Story 1.1: Build Local Express And SQLite Foundation
- Story 1.2: Establish Configuration, Data Access, And Test Foundation
- Story 2.1: Implement Owner Authentication And Route Protection
- Story 3.1: Implement Customer Account Management
- Story 3.2: Add Customer Search, Detail, And Validation Coverage
- Story 4.1: Implement Package Purchase, Fixed Pricing, And Bonus Crediting
- Story 4.2: Add Package Purchase History And Tests

Technical dependencies:

- `models/delivery-history.js`
- `recordDelivery(...)`
- `voidDelivery(...)`
- `listDeliveriesForCustomer(...)`
- `listRecentDeliveries(...)`
- `customer_accounts.current_balance`
- `delivery_history` table
- owner-authenticated admin portal

Downstream dependencies:

- delivery history and voiding story
- dashboard metrics
- customer portal usage history
- balance-progress and low-balance UI behavior

## Risks

### Risk 1: Delivery quantities are too restrictive

If the owner can only record a single cup, the workflow does not match real shop behavior and becomes awkward to use.

### Risk 2: Over-delivery corrupts the balance

If the application allows more cups to be delivered than remain in the balance, the prepaid ledger will be wrong.

### Risk 3: Zero-balance delivery is allowed

If the app lets the owner record a delivery when the balance is already empty, the ledger will become negative or inconsistent.

### Risk 4: Balance update and delivery record drift apart

If the balance is updated separately from the delivery record, the history and current balance could disagree.

### Risk 5: Delivery history is too sparse or inaccessible

If delivery records are not stored or reviewed properly, the owner loses traceability and later corrections become difficult.

## Risk Mitigation Approach

The delivered application shows the mitigation pattern clearly:

- delivery quantity is normalized and validated as a positive whole number
- delivery is blocked when the current balance is zero
- delivery is blocked when the requested cups exceed the current balance
- balance update and delivery insert occur in a transaction
- the delivery record stores both the delivered quantity and the resulting balance after the delivery

This keeps the current balance trustworthy while still supporting realistic multi-cup usage.

## Priority

Priority: High

Story 5.1 is high priority because it is the consumption side of the prepaid ledger. Package purchases are important, but without delivery recording the customer balance cannot be used in the actual shop. This story is what makes the membership program operational day to day.

## Success Metrics

The story is successful when the owner can record multi-cup deliveries accurately and the balance remains correct.

Business-capability success metrics:

- the owner can record a delivery of more than one cup
- invalid delivery quantities are rejected
- zero-balance and over-balance deliveries are blocked
- the customer balance decreases by exactly the delivered quantity
- delivery history can be reviewed later

Data-quality success metrics:

- each delivery record stores the delivered quantity and balance after the delivery
- the current balance matches the delivery ledger
- automated tests prove the balance-protection rules remain correct

Delivered evidence in the current application includes:

- `models/delivery-history.js`
- `routes/admin.js`
- delivery-related checks in `tests/phase1-owner.test.js`
- broader owner/customer flow coverage in `tests/e2e-owner-customer-flow.test.js`

## Success Criteria Traceability To Delivered Application

The reconstructed story planning maps directly to the completed application.

Implemented evidence:

- `models/delivery-history.js`
  - `normalizeDeliveredCups(...)`
  - `recordDelivery(...)`
  - `voidDelivery(...)`
  - `listDeliveriesForCustomer(...)`
  - `listRecentDeliveries(...)`
- `routes/admin.js`
  - delivery record form and save action
  - delivery history rendering
  - delivery validation messages
  - admin deliveries page
- `tests/phase1-owner.test.js`
  - zero-balance delivery rejection
  - over-balance delivery rejection
  - multi-cup delivery handling
  - balance-after verification
- `tests/e2e-owner-customer-flow.test.js`
  - delivery path verification in a real owner/customer flow

The current application therefore confirms that Story 5.1 was correctly framed as a multi-cup delivery and balance-protection capability, not as a single-cup or ad hoc adjustment feature.
