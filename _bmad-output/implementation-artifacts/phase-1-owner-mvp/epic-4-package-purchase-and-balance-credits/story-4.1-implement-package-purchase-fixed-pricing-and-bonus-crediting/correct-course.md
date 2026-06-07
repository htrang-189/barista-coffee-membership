# Problem Discovered

The original assumption for Story 4.1 could have been that package purchases were a straightforward form submission: choose a package, enter an amount, save the record, and update the balance. The delivered solution shows that this was too loose for the actual membership business. The story had to express a fixed-price VND rule, a specific bonus-credit policy, and a transactional ledger update all at once.

The problem was not with the idea of recording purchases. The problem was with underestimating how much business logic had to be protected by the implementation. Manual price entry would have produced inconsistent revenue records. Manual bonus handling would have produced incorrect balances. Non-transactional writes would have allowed the purchase history and balance field to drift apart.

## Root Cause

The root cause of the adjustment was the fact that the membership program is a fixed-package product, not a freeform payment system. The business rule is rigid:

- `10` cups purchased gives `11` credited
- `20` cups purchased gives `22` credited
- `30` cups purchased gives `33` credited
- each purchased cup is worth `30.000 ₫`

That meant the implementation needed to be rule-driven rather than input-driven. The original assumption of a generic amount-entry workflow would have produced too much room for error and too much responsibility on the owner to calculate correctly during service.

## Decision Taken

The delivered application took the stronger approach:

1. Use package size as the only purchase input.
2. Centralize the bonus-credit logic in a shared helper.
3. Calculate the amount automatically from the selected package size.
4. Update the purchase record and customer balance in one transaction.
5. Show a live preview in the owner UI so the calculated outcome is visible before save.

This decision made the implementation safer, more usable, and more faithful to the actual product.

## Updated Implementation Plan

The final implementation plan became:

1. Create a reusable package-credit helper that maps 10/20/30 to the exact credited cups.
2. Add a purchase model that calculates the amount from package size and writes the full purchase ledger row.
3. Update the customer balance in the same transaction as the purchase insert.
4. Render the purchase form on the customer detail page with package-size selection only.
5. Add a live preview showing amount paid, bonus cups, and total credited cups.
6. Persist purchase history for later owner and customer views.

This plan is much more robust than a simple form-based purchase record, but it is still small and MVP-appropriate.

## Impact On Architecture

The adjustment had a positive architectural impact.

1. It introduced a clear separation between rule calculation and transaction persistence.  
   `models/cup-balance.js` handles the rule; `models/package-purchase.js` handles the transaction.

2. It preserved a single source of truth for pricing.  
   The amount is derived from package size instead of being entered separately.

3. It reinforced the customer ledger as the central domain model.  
   Package purchase writes into the customer record and purchase history together, which keeps the app consistent.

No architecture was replaced. The adjustment clarified where business logic belongs and reduced future duplication risk.

## Impact On Future Stories

Story 4.1 directly affects the quality of all later balance-based stories.

1. Delivery stories can depend on correct current balance values.
2. Customer portal views can trust that the balance reflects real package credits.
3. Dashboard metrics can use stored revenue and bonus values without re-deriving them.
4. Purchase history views can show a reliable financial record.

The adjustment also means later stories should not reimplement package pricing or bonus logic. They should consume the stored ledger values.

## Lessons From The Adjustment

1. Fixed business rules should live in code, not in form instructions.  
   The app is safer when the package size determines the price and credits automatically.

2. Balance updates should be transactional whenever money-adjacent data is involved.  
   If the purchase record and balance can diverge, the ledger is not trustworthy.

3. The owner UI should show the calculated outcome before save.  
   That lowers the chance of error and reinforces the business rule visually.

4. A small MVP still needs a strong model boundary.  
   The purchase ledger is simple in product terms, but it is not trivial in data integrity terms.

5. Package purchase is not a generic payment workflow.  
   It is a controlled prepaid membership ledger action, and the implementation should reflect that.

The final delivered solution is better than the original simple form assumption because it encodes the real business rules directly into the application and protects the ledger from manual error.

