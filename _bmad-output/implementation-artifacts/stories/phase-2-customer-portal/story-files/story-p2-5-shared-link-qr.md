# Story P2-5: Shared Balance Link And QR Access

Status: Implemented
Phase: Phase 2 Customer Portal

## Objective

Allow owner-generated secure links and QR codes to open read-only balance pages.

## Requirements

- Each customer has `balance_access_token`.
- Shared token route renders read-only balance page.
- Invalid token returns 404.
- Full shared histories are read-only.
- Owner can copy link, show QR, and regenerate token.
- Regenerated token invalidates old link.

## Scope

Included: token generation, token route, QR generation, owner link controls.

Excluded: payments, ordering, public customer lookup.

## Files Created/Modified

- `models/customer-account.js`
- `routes/customer.js`
- `routes/admin.js`
- `public/js/admin.js`
- `tests/customer-portal.test.js`

## Routes/Models/Views Involved

- `GET /customer/access/:token`
- `GET /customer/access/:token/package-history`
- `GET /customer/access/:token/delivery-history`
- `POST /admin/customers/:customerId/balance-link/regenerate`

## Testing Evidence

- Valid token access.
- Invalid token 404.
- Token regeneration invalidates old link.
- Shared pages hide payment/admin controls.

## Delivered Output

Secure shared read-only access.

## Notes/Concerns

Shared token is a bearer secret and should be shared carefully.
