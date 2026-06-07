# Story 5.2: Implement Void Delivery And Delivery History

Phase: Phase 1: Owner MVP

Epic: Epic 5: Delivery Recording And History

Output type: `story-[slug].md`

Status: Reconstructed retrospective implementation story

## Story Title

Implement Void Delivery And Delivery History

## Business Context

The Barista Coffee Membership application already supports package purchases and multi-cup delivery recording. That means the owner can sell prepaid cups and subtract them from a customer balance. In real shop use, however, delivery mistakes happen. An entry may be recorded twice, entered against the wrong customer, or captured with the wrong quantity. A working membership ledger must therefore include a correction mechanism.

Story 5.2 exists to make the delivery ledger safe to operate in a real shop. Instead of deleting a mistaken delivery, the owner should be able to void it, restore the cups to the customer balance, and keep the original record available for auditability. The application’s delivered behavior shows that this story was correctly treated as part of the ledger model rather than a simple UI deletion action.

## User Story

As the owner, I want to void a mistaken delivery and review delivery history so that I can correct balance errors without losing the audit trail.

## Acceptance Criteria

1. The owner can view delivery history for a customer.
2. The owner can view recent delivery activity in the admin portal.
3. The owner can void an incorrect delivery record.
4. Voiding a delivery restores the delivered cups to the customer balance.
5. A delivery cannot be voided more than once.
6. The original delivery record remains visible after voiding.
7. The application records who voided the delivery.
8. Delivery history is displayed in newest-first order.
9. Delivery void actions are restricted to authenticated owners and protected by CSRF.
10. Automated tests cover delivery voiding and delivery history display.

## Functional Requirements

The application must display delivery history for each customer in the owner portal.

The application must display a recent-deliveries view in the admin portal for quick operational review.

The application must allow the owner to void an active delivery record.

The application must restore the delivered cup quantity to the customer balance when a delivery is voided.

The application must preserve the original delivery record after voiding rather than deleting it.

The application must store void metadata, including who performed the void action and when the void occurred.

The application must block repeated void attempts on the same delivery record.

The application must show delivery history in newest-first order so recent events are easiest to inspect.

The application must log delivery void actions for auditability.

## Non-Functional Requirements

The void workflow must be reliable because it changes the customer’s current balance.

The correction process must remain transactional so the restored balance and void status are always consistent.

The delivery history review must be quick enough for owner operations during the workday.

The implementation must align with the existing Express, SQLite, and server-rendered admin architecture.

The solution must preserve auditability by keeping the original delivery record visible after correction.

The feature must be testable at both the model and route level.

## UI Requirements

The owner portal must present delivery history in a clear, readable ledger format.

The customer detail page must show the customer’s delivery history and the current balance context.

The admin deliveries page must show recent deliveries with an obvious correction action for active entries.

Void actions must be visually distinct from ordinary navigation or record viewing.

The UI must provide immediate success and error feedback for voiding operations.

The UI should remain consistent with the rest of the Barista admin experience and not introduce a separate visual pattern.

## Database Requirements

The delivery history table must support void tracking fields so the original record can remain in place after correction.

The database must preserve the original delivered quantity even after the record is voided.

The database must store who performed the void and when the void occurred.

The customer balance must be restored in the same transaction as the void update.

The database design must keep delivery history auditable and immutable from a historical perspective.

## Technical Notes

The delivered application shows that the void-and-history behavior lives in the delivery model and admin routes.

`models/delivery-history.js` contains the delivery history queries and the `voidDelivery(...)` logic that restores cups to the customer balance while marking the record voided.

`routes/admin.js` renders the customer-specific history, the recent admin deliveries list, and the void action route.

The implementation uses the existing admin authentication and CSRF protections, which is correct because a void operation affects the ledger.

The history views are rendered server-side from the delivery ledger so the owner sees authoritative data from the database.

## Testing Requirements

Tests must verify that a delivery can be voided successfully.

Tests must verify that voiding a delivery restores the customer balance correctly.

Tests must verify that the same delivery cannot be voided twice.

Tests must verify that delivery history remains visible and ordered newest-first.

Tests must verify that delivery correction is available only to authenticated owners.

Tests should also verify that the full owner flow continues to work after the correction path is introduced.

## Definition Of Done

The story is done when the owner can review delivery history, void a mistaken delivery, restore the customer balance correctly, and rely on the ledger remaining auditable and consistent.

The story is not done if a void deletes the original record, if the balance can be restored twice, or if the owner cannot inspect delivery history in a practical way.

## Expected Delivered Output

The expected delivered output is a working delivery correction workflow in the admin portal that includes:

- customer delivery history review
- recent delivery activity review
- voiding of a mistaken delivery
- automatic balance restoration
- preservation of the original ledger event
- audit metadata for the correction action

The completed application confirms that this story was delivered as a ledger correction and history review capability within the Phase 1 owner MVP.
