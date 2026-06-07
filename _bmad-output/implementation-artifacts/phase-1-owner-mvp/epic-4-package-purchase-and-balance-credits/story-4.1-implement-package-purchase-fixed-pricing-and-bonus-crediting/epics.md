# Story 4.1: Implement Package Purchase, Fixed Pricing, And Bonus Crediting

Phase: Phase 1: Owner MVP

Epic: Epic 4: Package Purchase And Balance Credits

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 4.1 was to let the coffee shop owner record prepaid cup package purchases in a way that directly reflects the shop’s real pricing and membership rules. The membership program is not a flexible wallet or a general point system. It is a simple prepaid ledger with fixed package sizes, fixed pricing, and a defined bonus-credit policy. The owner needs to record that purchase cleanly so customer balances, revenue, and later deliveries all remain accurate.

In practical terms, this story is where the app starts handling the money-adjacent side of the membership business. If the owner cannot reliably record a purchase at the correct price or the balance credit is wrong, the app becomes less trustworthy than the manual method it is replacing. That is why the purchase workflow is central to the MVP, not secondary.

The completed application confirms that this was correctly framed. The current app records package purchases at fixed VND pricing, applies package-size-specific bonus credits, updates customer balance transactionally, and stores the resulting purchase record for history and reporting.

## Epic Objective

Epic 4: Package Purchase And Balance Credits exists to turn customer account records into a real prepaid membership ledger. The epic objective is to allow the owner to record a purchase, calculate the correct VND amount, apply the agreed bonus rule, update the customer’s balance in one transaction, and preserve a purchase history that supports later customer and owner views.

Within the epic, Story 4.1 is the core transactional business capability:

- fixed cup pricing
- package size selection
- automatic amount calculation
- bonus cup calculation
- balance crediting
- purchase record persistence
- revenue support for the owner dashboard and reports

This epic is not about delivery or customer self-service. It is about establishing the package purchase ledger that all later cup movement depends on.

## Story Objective

The objective of Story 4.1 was to implement the package purchase workflow so the owner can record a purchase using fixed package sizes and the system can automatically calculate the amount paid and bonus credits.

Using the delivered application as the source of truth, this includes:

- package sizes `10`, `20`, and `30`
- fixed pricing of `30.000 ₫` per cup
- automatic calculation of `amount_paid_cents`
- package bonus rules `10 -> 11`, `20 -> 22`, `30 -> 33`
- transactionally updating the customer’s current balance
- storing package purchase history
- displaying package purchase data in the owner portal and customer-facing views

This story is the point where the membership ledger becomes monetary and operationally meaningful.

## User Value

The primary user is the coffee shop owner.

The owner gains a predictable, low-friction way to record package purchases without doing manual calculations or maintaining separate spreadsheets for package size, bonus cups, and revenue. The workflow reduces mistakes because the amount and bonus are calculated by the application instead of being typed in by hand. That matters especially in a small shop where the same person may be managing the counter, the ledger, and the customer conversation at the same time.

There is also customer value. The customer’s current balance becomes more trustworthy because it reflects the exact membership package purchased. Customers benefit from consistent treatment of package sizes and bonus credits, which makes the prepaid membership relationship easier to understand and easier to trust.

For the product as a whole, this story turns customer accounts into real membership balances and creates a source of revenue history that later reporting and dashboard views can rely on.

## Acceptance Criteria

1. The owner can record a package purchase for an existing customer.
2. The package purchase supports only the approved package sizes `10`, `20`, and `30`.
3. The purchase workflow calculates the amount paid automatically using fixed cup pricing.
4. The amount paid is based on `30.000 ₫` per purchased cup.
5. The package bonus rule is applied automatically.
6. `10` purchased cups result in `11` total cups credited.
7. `20` purchased cups result in `22` total cups credited.
8. `30` purchased cups result in `33` total cups credited.
9. The customer’s current balance increases by the full credited amount in the same transaction.
10. The purchase record stores package size, bonus cups, total cups added, amount paid, and the admin user who created it.
11. The owner can view the purchase history for a customer.
12. The customer-facing balance and history views reflect the same purchase record.
13. Invalid package sizes are rejected.
14. The amount paid is not entered manually in the UI.
15. Package purchase behavior is backed by automated tests.

## Dependencies

Story 4.1 depended on earlier Phase 1 capabilities and customer-ledger work.

Prerequisite dependencies:

- Story 1.1: Build Local Express And SQLite Foundation
- Story 1.2: Establish Configuration, Data Access, And Test Foundation
- Story 2.1: Implement Owner Authentication And Route Protection
- Story 3.1: Implement Customer Account Management
- Story 3.2: Add Customer Search, Detail, And Validation Coverage

Technical dependencies:

- `models/cup-balance.js`
- `models/package-purchase.js`
- `recordPackagePurchase(...)`
- `calculatePackageCredits(...)`
- `calculatePackageAmountPaidCents(...)`
- `customer_accounts.current_balance`
- `package_purchases` table
- owner-authenticated admin routes

Downstream dependencies:

- delivery recording and balance-decrement stories
- dashboard metrics
- purchase history views for owner and customer
- customer portal balance and package history

## Risks

### Risk 1: Pricing is entered manually and becomes inconsistent

If the owner types the amount by hand, package prices will drift from the actual business rule and revenue history will become unreliable.

### Risk 2: Bonus credits are calculated incorrectly

If the bonus rule is inconsistent, the customer balance will be wrong and the owner will lose trust in the ledger.

### Risk 3: Balance updates and purchase records become mismatched

If the purchase record is written but the customer balance is not updated atomically, the ledger can diverge from the balance view.

### Risk 4: Package sizes are too flexible

If arbitrary package sizes are allowed, the owner may create records that do not correspond to any real membership product.

### Risk 5: Revenue reporting becomes unreliable

If purchase amounts are not normalized to the fixed per-cup price, later reporting and dashboard metrics will be wrong.

## Risk Mitigation Approach

The delivered application shows the mitigation pattern clearly:

- the package purchase model calculates both credited cups and amount paid
- only the approved package sizes are accepted
- purchase insert and balance update happen inside a transaction
- the amount is derived from the package size, not typed manually
- purchase history persists the exact amount, bonus, and total cups added

This approach keeps the business rules inside the application rather than relying on memory or manual arithmetic.

## Priority

Priority: High

Story 4.1 is high priority because it is the first point where the prepaid membership ledger becomes financially meaningful. Without package purchase recording, the app would have customer records but no actual cup crediting or revenue history. That makes this story one of the core business-value stories in Phase 1.

## Success Metrics

The story is successful when the owner can record a purchase and trust that the balance and revenue are correct without manual calculation.

Business-capability success metrics:

- the owner can record `10`, `20`, and `30` cup packages
- the application calculates the amount paid automatically
- the application applies the correct bonus rule automatically
- the customer balance changes immediately after purchase
- purchase history is visible and trustworthy

Data-quality success metrics:

- purchase records store the correct package size, bonus, amount, and admin actor
- customer balances match the total credited cups
- invalid package sizes are rejected

Delivered evidence in the current application includes:

- `models/cup-balance.js`
- `models/package-purchase.js`
- `routes/admin.js`
- `public/js/admin.js`
- package purchase tests in `tests/phase1-owner.test.js`
- dashboard and customer portal tests that read the purchase outcomes

## Success Criteria Traceability To Delivered Application

The reconstructed story planning maps directly to the completed application.

Implemented evidence:

- `models/cup-balance.js`
  - package-size-to-credit mapping
- `models/package-purchase.js`
  - `calculatePackageAmountPaidCents(...)`
  - `recordPackagePurchase(...)`
  - `listPackagePurchasesForCustomer(...)`
- `routes/admin.js`
  - package purchase form and save action
  - package history rendering
- `public/js/admin.js`
  - purchase preview showing amount, bonus, and total credited cups
- `tests/phase1-owner.test.js`
  - fixed pricing checks
  - bonus rule checks
  - balance update checks
  - invalid package size rejection

The current application therefore confirms that Story 4.1 was correctly framed as a fixed-price package purchase and balance-credit capability, not as a generic payment-entry form.
