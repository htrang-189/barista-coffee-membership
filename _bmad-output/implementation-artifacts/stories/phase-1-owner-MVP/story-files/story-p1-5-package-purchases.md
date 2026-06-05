# Story P1-5: Package Purchase And Fixed Pricing

Status: Implemented
Phase: Phase 1 Owner/Admin Portal

## Objective

Allow the owner to record prepaid package purchases and update customer balances.

## Requirements

- Package sizes are 10, 20, or 30 only.
- Price is calculated at `30.000 ₫` per purchased cup.
- Amount is stored as `amount_paid_cents`.
- Manual amount entry is not shown.
- Balance update is transactional.

## Scope

Included: package form, server-side purchase model, fixed VND pricing, purchase history.

Excluded: payment processing.

## Files Created/Modified

- `models/package-purchase.js`
- `models/currency.js`
- `routes/admin.js`
- `public/js/admin.js`
- `tests/phase1-owner.test.js`
- `tests/currency.test.js`

## Routes/Models/Views Involved

- `POST /admin/customers/:customerId/package-purchases`
- `GET /admin/customers/:customerId/package-purchases`
- `models/package-purchase.js`

## Testing Evidence

- Fixed VND pricing tests.
- Balance update tests.
- Invalid package size test.
- Owner UI test confirms no manual amount input.

## Delivered Output

Package purchase workflow with recorded VND revenue.

## Notes/Concerns

Revenue is recorded operationally and is not accounting-grade payment settlement.
