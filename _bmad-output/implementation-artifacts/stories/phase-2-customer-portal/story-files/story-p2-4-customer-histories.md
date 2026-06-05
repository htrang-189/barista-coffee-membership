# Story P2-4: Customer Package And Cup Histories

Status: Implemented
Phase: Phase 2 Customer Portal

## Objective

Show customer-safe package and cup history with compact previews and full-history pages.

## Requirements

- Balance page shows 5 recent package purchases.
- Balance page shows 5 recent deliveries.
- `View All` opens full package and delivery history pages.
- Histories are newest first.
- Payment amounts and admin actions are hidden.

## Scope

Included: customer history rendering and full-history routes.

Excluded: customer mutations.

## Files Created/Modified

- `routes/customer.js`
- `views/customer/balance.html`
- `tests/customer-portal.test.js`

## Routes/Models/Views Involved

- `GET /customer/package-history`
- `GET /customer/delivery-history`
- `listPackagePurchasesForCustomer()`
- `listDeliveriesForCustomer()`

## Testing Evidence

- Preview limit tests.
- Full-history tests.
- Payment amount hidden tests.

## Delivered Output

Customer-safe history views.

## Notes/Concerns

Voided deliveries are labelled when shown.
