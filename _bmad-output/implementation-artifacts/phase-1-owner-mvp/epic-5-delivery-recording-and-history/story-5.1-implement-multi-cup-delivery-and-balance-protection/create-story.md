# Story 5.1: Implement Multi-Cup Delivery And Balance Protection

Phase: Phase 1: Owner MVP

Epic: Epic 5: Delivery Recording And History

Output type: `story-[slug].md`

Status: Reconstructed retrospective implementation story

## Story Title

Implement Multi-Cup Delivery And Balance Protection

## Business Context

The Barista Coffee Membership product already supports package purchases and balance crediting. That means the shop can sell prepaid cup bundles, but a prepaid bundle only becomes operational when the owner can record actual cup usage against that balance. Story 5.1 exists to close that gap.

In the real shop, customers do not always redeem exactly one cup at a time. A visit may use several cups, and the owner needs to record that consumption quickly while preserving the integrity of the prepaid ledger. If the system only supports one-cup deliveries or allows invalid delivery quantities, the ledger becomes cumbersome or inaccurate. That would reduce trust in the membership program and create operational friction at the counter.

The completed application shows that this story was implemented as a multi-cup delivery workflow with strong balance protection. The story therefore belongs in the core owner MVP, because it is the point where prepaid credit turns into actual, trackable shop usage.

## User Story

As the owner, I want to record one or more cups delivered to a customer so that the customer’s prepaid balance is reduced accurately and the delivery is stored as part of the permanent ledger.

## Acceptance Criteria

1. The owner can record a delivery for more than one cup in a single action.
2. The delivery quantity accepts only positive whole numbers.
3. The application blocks delivery when the customer balance is zero.
4. The application blocks delivery when the requested quantity is greater than the customer’s remaining balance.
5. The customer’s current balance is reduced by the delivered quantity when the delivery is valid.
6. The delivery record stores the delivered quantity and the balance remaining after the delivery.
7. The owner can review delivery history for the customer.
8. Invalid delivery attempts do not change the customer balance.
9. Delivery recording is protected by owner authentication.
10. Automated tests verify the balance protection rules and ledger consistency.

## Functional Requirements

The application must allow an authenticated owner to enter a delivered cup quantity for a customer.

The application must treat delivered cups as a positive whole-number quantity, not as a fixed single-cup event.

The application must validate that the requested quantity is greater than zero.

The application must validate that the requested quantity does not exceed the customer’s current balance.

The application must reject delivery attempts when the customer balance is zero.

The application must write a delivery ledger record whenever a valid delivery is submitted.

The application must update the customer’s current balance in the same operation as the delivery record to prevent drift.

The application must store sufficient delivery history to explain what was delivered and what balance remained afterward.

The application must allow the owner to review delivery history from the customer detail workflow.

## Non-Functional Requirements

The delivery workflow must be reliable because it affects financial-like ledger data.

The delivery update must be atomic so that the balance and history cannot diverge.

The delivery validation must be deterministic and easy to test.

The workflow must be fast enough for counter use, where the owner may be recording deliveries during active service.

The implementation must remain consistent with the existing Express, SQLite, and server-rendered admin UI architecture.

The solution must avoid introducing hidden side effects or background processes that would complicate ledger tracing.

## UI Requirements

The owner interface must expose a clear delivery entry control on the customer detail page or equivalent admin workflow.

The quantity entry must be obvious and constrained to valid numeric input.

The interface must show validation feedback when the owner tries to deliver zero cups, a negative value, or more cups than remain.

The interface must show the customer’s current balance so the owner can make an informed delivery entry.

The interface must include a delivery history section that helps the owner confirm what was recorded.

The UI should stay consistent with the existing Barista admin styling and not introduce a separate visual language.

## Database Requirements

The database must store each delivery as a ledger event rather than as an editable free-form record.

The delivery history record must include at least the customer reference, the quantity delivered, the balance before delivery, the balance after delivery, the owner who recorded it, and the timestamp.

The customer account balance must be updated in the same transaction as the delivery history insert.

The database layer must prevent negative or invalid balance states through application validation and transaction logic.

The design must preserve a trustworthy historical trail for later reporting or corrections.

## Technical Notes

The delivered application shows that this story was implemented in the model and admin route layers rather than as a UI-only change.

Delivery logic lives in `models/delivery-history.js`, where the application normalizes the delivered quantity, checks balance availability, inserts the delivery record, and updates the customer balance transactionally.

The admin route layer exposes the delivery workflow and handles the form submission path in `routes/admin.js`.

The delivery history is rendered from the persisted ledger data so the owner can review past consumption.

The business rule is intentionally strict: only positive whole-number quantities are allowed, and the application must reject delivery when there is not enough balance.

This prevents the prepaid ledger from drifting and keeps the delivery operation safe under real shop conditions.

## Testing Requirements

The story requires automated coverage for the core balance-protection behaviors.

Tests must verify that a valid multi-cup delivery reduces the balance correctly.

Tests must verify that zero-balance deliveries are rejected.

Tests must verify that over-balance deliveries are rejected.

Tests must verify that the delivery history stores the resulting balance after the transaction.

Tests must verify that the delivery update remains transactional and does not leave partial state behind.

Tests must also confirm that delivery actions are available only to authenticated owners.

## Definition Of Done

The story is done when the owner can record one or more cups delivered to a customer, the customer balance updates correctly, the delivery is stored in history, invalid quantities are blocked, and automated tests prove the ledger stays consistent.

The story is not done if the app still behaves like a one-cup-only delivery system, if the balance can go negative, or if delivery and balance updates can drift apart.

## Expected Delivered Output

The expected delivered output is a working owner delivery workflow in the admin portal that can:

- accept multi-cup delivery quantities
- validate the requested amount against the remaining balance
- write a delivery ledger entry
- update the customer balance transactionally
- show the delivery history back to the owner
- reject invalid delivery attempts without corrupting the ledger

The completed application confirms that this story delivered the multi-cup delivery and balance-protection capability as part of the Phase 1 owner MVP.
