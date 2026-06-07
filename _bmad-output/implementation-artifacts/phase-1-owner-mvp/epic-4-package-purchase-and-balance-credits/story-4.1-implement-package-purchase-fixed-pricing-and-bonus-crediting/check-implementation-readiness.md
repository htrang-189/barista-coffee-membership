# Readiness Purpose

This gate checks whether Story 4.1 was ready to implement before development began. The story is a core business-capability story because it turns customer accounts into a prepaid cup ledger with real pricing, real balance credits, and real revenue records. It must be ready before implementation because mistakes here would directly affect customer balances and shop revenue.

## Story Readiness Summary

Story 4.1 was ready for implementation. The prerequisite infrastructure was already in place, the customer ledger existed, the owner portal was protected, and the business rules for package sizes and pricing were sufficiently clear. The story had a well-defined scope: fixed pricing, automatic amount calculation, bonus crediting, transaction-safe balance updates, and purchase history.

The main risk was that pricing could be treated as a manual input problem rather than a business-rule problem. The delivered application shows that the story correctly moved pricing logic into application code and tests, which is what made it ready to ship safely.

## Required Inputs

The story required the following inputs before implementation could begin:

- a working owner-authenticated admin portal
- a customer account record with current balance
- a package purchase table and model boundary
- a clear package-size policy
- a fixed per-cup price
- a defined bonus rule for each allowed package size
- a plan for where purchase history would be displayed

Those inputs were available in the delivered application design and in the Phase 1 architecture.

## Technical Preconditions

- Express admin routes must already exist.
- SQLite data access must be available.
- Customer records must already store current balance.
- The app must have a place to persist package purchases.
- The existing codebase must support transaction-safe database updates.
- Price and bonus calculations must be implementable in a model or helper layer.

These preconditions were met by the project’s delivered foundation.

## Business Preconditions

- The coffee shop sells only a small fixed set of membership packages.
- The owner does not need a generic invoice editor.
- Pricing is fixed and must not be manually typed per purchase.
- Bonus-credit policy is business-defined and must be applied automatically.
- The owner needs a purchase history, not just a balance field.

These business conditions make the story a good fit for the MVP.

## Data Preconditions

- Customer current balance must already exist in the data model.
- Package purchases must be storeable with package size, bonus cups, total cups added, amount paid, and admin actor.
- The database must be able to support transactional write behavior.
- The purchase table must be suitable for later owner and customer history views.

The delivered package-purchase model confirms these assumptions were in place.

## UI/UX Preconditions

- The owner should be able to choose from only the approved package sizes.
- The UI should show the calculated price before save.
- The UI should show the bonus cups and total credited cups before save.
- The flow should remain simple enough for daily shop use.

No advanced checkout UI was needed, which kept the story realistic for the MVP.

## Risks And Mitigations

### Risk 1: Manual amount entry causes pricing errors

Mitigation:

- calculate the amount in application code from the selected package size
- do not expose a free-text amount field in the final workflow

### Risk 2: Bonus cups are applied inconsistently

Mitigation:

- centralize package credit rules in a shared helper
- cover each approved package size with automated tests

### Risk 3: Balance and purchase records drift apart

Mitigation:

- update the purchase record and customer balance inside a single transaction

### Risk 4: Arbitrary package sizes create ledger noise

Mitigation:

- allow only the approved package sizes `10`, `20`, and `30`

### Risk 5: Revenue reporting becomes inaccurate

Mitigation:

- store the calculated paid amount in the purchase record
- reuse the stored amount for dashboard and history views

## Dependency Review

The story depended on the following:

- Story 1.1 foundation for Express and SQLite
- Story 1.2 configuration, data access, and test foundation
- Story 2.1 owner authentication and route protection
- Story 3.1 customer account management
- Story 3.2 customer search, detail, and validation coverage

Those dependencies were already satisfied in the delivered application architecture. No blocker remained.

## Readiness Checklist

- [x] Requirements for fixed pricing are clear.
- [x] Allowed package sizes are defined.
- [x] Bonus credit rules are defined.
- [x] Customer balance storage exists.
- [x] Owner-authenticated admin routes exist.
- [x] Transactional database behavior is available.
- [x] Purchase history has a planned display surface.
- [x] Testing can verify success and failure behavior.
- [x] No ambiguous payment workflow remains in scope.

## Risks

### Risk A: Pricing logic is not centralized

If the amount calculation is duplicated in multiple places, future changes to package pricing could diverge.

### Risk B: The UI still suggests manual payment entry

If the form allows free-form amounts, the owner could enter values that do not match the business rule.

### Risk C: Balance updates are not atomic

If the purchase record and balance update are not treated as one operation, the ledger may become inconsistent.

### Risk D: The story is under-specified around bonus rules

If the `10/20/30` bonuses are not explicitly tied to package size, the app could produce the wrong balance.

## Mitigations

1. Put the calculation logic in a shared package-credit helper.
2. Use the package size as the only input for amount calculation.
3. Update the customer balance and purchase record inside a transaction.
4. Test each allowed package size and reject invalid sizes.
5. Render the purchase preview in the UI so the owner can verify the result before save.

## Final Decision

READY FOR IMPLEMENTATION

## Rationale For Decision

The story had the right level of completeness because the business rule was simple, the architecture already supported the required data flow, and the implementation path was obvious: a fixed-size package with automatic price and bonus calculation written into a transactional purchase record. The story was not blocked by missing infrastructure or undefined business behavior.

The readiness was especially strong because the story could be expressed as a narrow, testable capability:

- select a package size
- calculate a fixed amount
- apply a fixed bonus rule
- update balance and record purchase together

That is exactly the kind of well-defined scope that should move into implementation in the MVP.

## Notes For Implementation

- Do not reintroduce manual amount entry.
- Keep pricing derived from package size.
- Keep the bonus logic in one place.
- Ensure the owner can see the preview before saving.
- Preserve transaction safety for purchase and balance updates.
- Keep the package options constrained to the approved sizes only.

