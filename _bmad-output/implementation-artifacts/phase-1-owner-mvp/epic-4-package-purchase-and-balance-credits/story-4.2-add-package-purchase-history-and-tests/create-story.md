# Story Title

Story 4.2: Add Package Purchase History And Tests

## Business Context

The package purchase workflow only becomes genuinely useful when the resulting transaction can be reviewed later. The coffee shop owner needs to know what was purchased, when it was purchased, how many bonus cups were granted, and how much revenue was recorded. The customer also benefits from seeing a readable purchase history in their read-only views because that history reinforces trust in the prepaid membership balance.

Story 4.1 already established the fixed-price purchase logic and transactional balance updates. Story 4.2 completes that capability by making the ledger visible and test-protected. In business terms, this story turns a working purchase function into an auditable membership record.

The delivered application confirms that this is the correct framing. Package purchase history is visible on the owner customer detail page, in customer portal history sections, and through shared balance-link views. The history is ordered newest first and summary sections use a recent-records pattern with `View All` navigation when needed.

## User Story

As the coffee shop owner and as a customer viewing my own balance,  
I want package purchase history to be visible and reliable,  
so that I can review what was purchased, confirm the balance changes, and trust the membership ledger.

## Acceptance Criteria

1. The owner can view package purchase history for a customer.
2. The package purchase history is ordered newest first.
3. The purchase history shows the package size, bonus cups, total cups added, amount paid, and the admin actor.
4. The customer portal shows package purchase history in a read-only format.
5. Shared balance-link views show package purchase history in a read-only format.
6. Recent-history sections show only the most recent records by default.
7. Recent-history sections provide a `View All` path to the full history.
8. Purchase history uses the same stored purchase records created by the fixed-price purchase workflow.
9. Automated tests verify that purchase history and the package purchase ledger remain consistent.
10. The story does not change the fixed pricing or bonus-credit rules.

## Functional Requirements

1. The system shall display package purchase history on the owner customer detail page.
2. The system shall display package purchase history in customer-facing read-only views.
3. The system shall order package purchases newest first.
4. The system shall support summary views that show only a limited number of recent records by default.
5. The system shall provide a `View All` action to reach the full purchase history.
6. The system shall render package purchase history from the stored purchase ledger, not from a separate calculated source.
7. The system shall keep package history tied to the correct customer account.
8. The system shall preserve the existing fixed-price purchase logic without alteration.
9. The system shall add or preserve automated tests for package purchase and history behavior.
10. The system shall keep customer-facing history read-only.

## Non-Functional Requirements

1. History pages shall remain readable and compact for a small coffee shop owner.
2. Summary views shall avoid overwhelming the user with long purchase lists.
3. Full history views shall remain consistent with the same ledger source of truth.
4. The implementation shall remain simple enough for a local SQLite-based MVP.
5. The history display shall not duplicate business logic that already exists in the purchase model.
6. The test coverage shall be strong enough to protect the package ledger against regression.

## UI Requirements

1. The owner customer detail page shall show package purchase history clearly.
2. The customer portal shall show package purchase history in a read-only presentation.
3. Shared balance-link views shall show the same purchase history presentation safely.
4. Summary views shall show recent records only, with a `View All` link for the complete history.
5. History items shall be ordered newest first.
6. The UI shall not expose admin actions in customer-facing purchase history areas.

## Database Requirements

1. Package purchase history shall be read from the existing `package_purchases` table.
2. The purchase table shall continue to store package size, bonus cups, total cups added, amount paid, and the admin actor.
3. No new schema is required for this story.
4. The same ledger record shall drive both owner and customer history displays.

## Technical Notes

1. History rendering should use the existing package-purchase model rather than a new query layer.
2. Summary views should slice the already-ordered purchase list to the desired preview size.
3. `View All` behavior should preserve access to the full history without changing the underlying ledger.
4. Customer-facing history must remain read-only and should not render owner-only controls.
5. Tests should cover both the history display and the package purchase calculations it depends on.
6. The story should not alter the pricing helper or the transaction logic from Story 4.1.

## Testing Requirements

1. Verify that owner package purchase history is visible and ordered newest first.
2. Verify that customer-facing package history is visible in read-only views.
3. Verify that summary views limit the number of visible purchase records.
4. Verify that `View All` paths lead to the full history.
5. Verify that purchase history displays package size, bonus cups, total cups added, amount paid, and admin actor.
6. Verify that package purchase and balance tests from Story 4.1 remain correct after history changes.
7. Verify that customer-facing history does not expose admin actions.

## Definition Of Done

The story is done when:

1. Package purchase history is visible to the owner and to the customer in read-only form.
2. The history is ordered newest first and remains tied to the same purchase ledger.
3. Summary views stay compact and provide `View All` access.
4. The fixed-price purchase logic from Story 4.1 remains unchanged.
5. Automated tests verify both the purchase ledger and the history display behavior.

