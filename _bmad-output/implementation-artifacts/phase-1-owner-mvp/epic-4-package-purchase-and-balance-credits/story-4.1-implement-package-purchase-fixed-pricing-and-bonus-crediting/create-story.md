# Story Title

Story 4.1: Implement Package Purchase, Fixed Pricing, And Bonus Crediting

## Business Context

The coffee shop’s membership program depends on the owner being able to record prepaid cup purchases with confidence. This story is where the ledger becomes financially meaningful. The owner is not simply attaching notes to a customer record. The owner is recording a real purchase at a fixed shop price, applying the agreed bonus credit policy, and increasing the customer’s cup balance in a way that later delivery and customer-portal views can trust.

In the delivered application, the package purchase workflow is exactly that: a fixed-price, fixed-size, owner-recorded transaction that updates the customer balance and stores the purchase in history. The business rule is intentionally simple. The shop sells only 10, 20, and 30 cup packages. Each cup has a fixed price of `30.000 ₫`. The bonus policy is also fixed: `10 -> 11`, `20 -> 22`, and `30 -> 33`. That gives the owner a predictable and repeatable way to manage prepaid membership credit without manual calculations.

If the amount were entered manually, the application would create revenue and balance errors. If the bonus rule were inconsistent, customers would lose trust in the ledger. This story exists to prevent both problems.

## User Story

As the coffee shop owner,  
I want to record package purchases using fixed package sizes and automatic pricing,  
so that customer balances and revenue history are calculated correctly without manual arithmetic.

## Acceptance Criteria

1. The owner can record a package purchase for an existing customer.
2. The package purchase accepts only the approved package sizes: 10, 20, and 30 cups.
3. The application calculates the amount paid automatically from the selected package size.
4. The application uses a fixed price of `30.000 ₫` per cup.
5. The application applies the bonus rules automatically.
6. A 10-cup package credits 11 total cups.
7. A 20-cup package credits 22 total cups.
8. A 30-cup package credits 33 total cups.
9. The customer’s current balance increases by the total credited cups.
10. The purchase record stores the package size, bonus cups, total cups added, amount paid, and the admin user who recorded it.
11. The owner can see a preview of the calculated amount and bonus before saving.
12. Invalid package sizes are rejected.
13. The purchase flow does not require manual amount entry.
14. Purchase history is available for review after the purchase is recorded.

## Functional Requirements

1. The system shall allow package purchases only for package sizes 10, 20, and 30.
2. The system shall calculate the paid amount from the selected package size.
3. The system shall calculate the bonus cups from the selected package size.
4. The system shall update the customer’s current balance by the total credited cups.
5. The system shall store the purchase as a permanent ledger record.
6. The system shall record the admin user who created the purchase.
7. The system shall reject invalid package sizes before write.
8. The system shall present a preview of the amount and bonus to the owner before the purchase is saved.
9. The system shall make purchase history available for later owner and customer views.
10. The system shall keep the package purchase workflow tied to the selected customer account.

## Non-Functional Requirements

1. The workflow shall be simple enough for a busy shop owner to use quickly.
2. The calculation rules shall be consistent and not depend on manual arithmetic.
3. The purchase record and balance update shall remain consistent with each other.
4. The implementation shall fit the project’s low-maintenance Express and SQLite architecture.
5. The UI shall remain concise and operational rather than payment-processor-like.
6. The bonus-credit logic shall remain deterministic and easy to test.

## UI Requirements

1. The purchase form shall present only the approved package sizes.
2. The UI shall show the calculated amount paid before the owner saves the purchase.
3. The UI shall show the bonus cups and total credited cups before save.
4. The UI shall not include a free-text payment amount field.
5. The UI shall keep the workflow inside the owner/admin customer detail page.
6. The purchase history should be visible after the purchase is recorded.

## Database Requirements

1. The system shall store package purchases in SQLite.
2. Each purchase record shall store package size, bonus cups, total cups added, amount paid, and the admin actor.
3. The customer account record shall store the updated current balance.
4. The balance update and purchase record insert shall be transactionally consistent.
5. The stored amount shall be used later by history and reporting features.

## Technical Notes

1. The package-credit rules should be centralized in a helper so the same logic can drive the UI preview, the transaction write, and the tests.
2. The amount calculation should derive from package size only; it should not accept manual override values.
3. The customer balance update should occur in the same transaction as the purchase insert.
4. The customer detail page should act as the owner’s working surface for package purchases.
5. The purchase history should be stored in newest-first order for straightforward review.
6. The UI preview should be generated from the same business rule used when the purchase is saved.

## Testing Requirements

1. Verify that a 10-cup package credits 11 cups.
2. Verify that a 20-cup package credits 22 cups.
3. Verify that a 30-cup package credits 33 cups.
4. Verify that the amount paid is calculated automatically for each allowed package size.
5. Verify that invalid package sizes are rejected.
6. Verify that the customer balance increases correctly after a purchase.
7. Verify that the preview shows the correct amount and bonus before save.
8. Verify that the stored purchase history reflects the recorded amount and bonus.

## Definition Of Done

The story is done when:

1. The owner can record package purchases using only the approved package sizes.
2. The amount paid is calculated automatically at a fixed `30.000 ₫` per cup.
3. The bonus rule is applied automatically and correctly.
4. The customer balance updates safely in the same transaction as the purchase record.
5. The purchase record is stored for later history and reporting use.
6. The owner does not need to type or calculate payment amounts manually.

