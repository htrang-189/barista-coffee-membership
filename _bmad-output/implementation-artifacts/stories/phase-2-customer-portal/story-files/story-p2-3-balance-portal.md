# Story P2-3: Read-Only Customer Balance Portal

Status: Implemented
Phase: Phase 2 Customer Portal

## Objective

Show the customer their current balance and usage without allowing mutations.

## Requirements

- Show customer name.
- Show remaining cups prominently.
- Show used cups.
- Show low-balance message when balance is `<= 5`.
- Hide payment amounts and admin actions.

## Scope

Included: balance page, used-cup calculation, low-balance display.

Excluded: customer package/delivery edits.

## Files Created/Modified

- `routes/customer.js`
- `views/customer/balance.html`
- `public/css/styles.css`
- `tests/customer-portal.test.js`

## Routes/Models/Views Involved

- `GET /customer/balance`
- Package and delivery history readers.

## Testing Evidence

- Balance page test.
- Read-only assertions.
- Own-data assertions.

## Delivered Output

Customer self-service balance view.

## Notes/Concerns

Customer-facing UI is intentionally read-only.
