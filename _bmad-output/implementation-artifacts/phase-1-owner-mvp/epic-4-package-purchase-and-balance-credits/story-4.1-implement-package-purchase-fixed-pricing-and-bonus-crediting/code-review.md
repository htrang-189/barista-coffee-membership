# Findings

## Architecture Compliance

The implementation of Story 4.1 is well aligned with the application architecture already established in the project. Package credit logic lives in a dedicated helper module, purchase recording lives in a separate model, and the owner workflow is exposed through the existing protected admin routes. This is the correct shape for a transactional ledger feature in a small Express and SQLite application.

The model split is especially appropriate. `models/cup-balance.js` contains the business rules for package size and bonus credits, while `models/package-purchase.js` handles the transactional purchase write. That separation keeps the pricing rule reusable and keeps the database transaction boundary in the place where it belongs. The route layer stays focused on HTTP behavior and rendering.

The implementation also respects the broader architecture by keeping the customer account as the source of truth for current balance. The purchase record and the balance field are updated together, which matches the app’s ledger-first design. There is no sign of a parallel data store or a detached calculation path.

## Coding Standards

The code is readable, direct, and appropriate for the size of the codebase. The helper and model names are clear, the functions are single-purpose, and the transaction logic is easy to follow. The implementation does not over-abstract, which is good here because the business rules are simple and explicit.

Positive coding-standard observations:

1. Package rules are centralized in a helper instead of being repeated.
2. The purchase model exposes focused functions with clear names.
3. The route code delegates purchase logic rather than embedding SQL directly in the handler.
4. The UI preview logic uses a simple mapping that mirrors the business rules.

One quality note is that the fixed pricing constant is defined in the model as `CUP_PRICE_CENTS = 30000 * 100`, which is mathematically correct for the delivered application but slightly less self-describing than a direct comment or constant naming that explicitly indicates the final VND total. That is not a defect, just a readability consideration.

## Security

The security posture is appropriate for the MVP and for the scope of a package purchase ledger.

Verified strengths:

1. Package purchases are owner-only actions behind the existing admin auth boundary.
2. The form does not accept manual amount entry, reducing the risk of accidental or hostile ledger manipulation.
3. The purchase transaction updates the ledger atomically, reducing tampering and partial-write risk.
4. The admin action log records the purchase event, which improves traceability.

No new public exposure was introduced. The purchase workflow remains inside the protected admin portal, which is correct because package purchases affect revenue and customer balances.

## Validation

The validation behavior is strong and business-driven.

Key validation behaviors:

1. Only package sizes 10, 20, and 30 are accepted.
2. Invalid package sizes throw a business-level error.
3. The amount paid is calculated from package size rather than user input.
4. The preview shows the expected amount, bonus, and credited cups.
5. The customer balance is updated only when the transaction succeeds.

This is the correct validation model for the story because the application is enforcing real business rules, not just UI constraints. The owner is given a constrained selector and a calculated preview, which aligns the UI with the server-side rules.

## Database Integrity

Database integrity is one of the strongest parts of this implementation.

Positive observations:

1. The purchase record and balance update are wrapped in a transaction.
2. The purchase record stores package size, bonus cups, total cups added, amount paid, and admin actor.
3. The customer balance is increased by the credited cups in the same transaction.
4. The history query reads purchase data in newest-first order for stable reporting.

This design prevents the most serious failure mode in a ledger application: recording a purchase without updating the balance, or updating the balance without a matching purchase record. The implementation avoids that problem directly.

The only minor concern is that the stored amount is expressed in cents in the database, while the business narrative is in VND. That is acceptable and technically sound, but it depends on consistent formatting everywhere the value is displayed. The delivered code does that correctly.

## Error Handling

Error handling is practical and in line with the project’s style.

1. Invalid package sizes result in explicit errors.
2. Failed transactions roll back cleanly.
3. The admin route remains responsible for presenting the form and the preview, while the model is responsible for purchase logic.
4. The owner UI does not expose a manual payment field that would need extra error handling.

The story does not introduce unnecessary error complexity. That is the right choice. The main user-visible errors that matter are invalid package size and transaction failure, and the implementation handles those cases appropriately.

## UI Consistency

The UI behavior is consistent with the rest of the owner portal.

Observed consistency points:

1. The package purchase form lives on the customer detail page, which is consistent with the ledger workflow.
2. The style and layout follow the same card-and-form patterns already used in the admin area.
3. The preview box gives the owner immediate operational feedback without introducing a new screen type.
4. The purchase history section appears in the same detail view, which matches the application’s workflow-centered design.

The live preview is especially important because it makes the fixed pricing rule visible to the owner before submission. That is a good UX choice for an operational ledger tool.

## Test Coverage

The test coverage is appropriate and meaningful.

Covered behavior includes:

1. 10 cup package credits 11 total cups
2. 20 cup package credits 22 total cups
3. 30 cup package credits 33 total cups
4. Invalid package size rejection
5. Customer balance updates transactionally
6. VND purchase preview rendering
7. Package history and downstream balance effects

The tests cover both the computation and the ledger write, which is exactly what this story needs. The most important risk here is not layout drift; it is arithmetic and transaction correctness. The delivered tests target those risks directly.

## Issues

## Low: Price formatting is computed indirectly from cents

The application stores and calculates the price correctly, but the implementation requires the reader to understand that `30000 * 100` produces the displayed VND amount. This is technically correct but a little opaque.

Impact:

- No functional problem.
- Slight readability cost for future maintainers.

## Low: The preview mapping duplicates the business rule in the UI layer

The admin preview uses a direct mapping of package size to amount/bonus/total in the JavaScript bundle. That is acceptable, but it does mean the UI preview carries a mirror of the same rule that exists in the model helper.

Impact:

- The current implementation stays consistent.
- Future changes should keep the preview mapping synchronized with the helper.

## Recommendations

1. Approve the implementation as delivered.
2. Keep the package-credit helper as the single source of truth for the business rule.
3. If the package catalog ever changes, update the helper and preview together and extend tests immediately.
4. Preserve the transactional boundary around purchase insert and balance update.

# Approval Decision

The implementation is architecture-compliant, correctly constrained, secure for the MVP, and strongly protected by tests. It records package purchases in a way that is faithful to the actual business rules and preserves ledger integrity.

APPROVED
