# Story P2-2: Customer Route Authorization

Status: Implemented
Phase: Phase 2 Customer Portal

## Objective

Ensure customers can only access their own read-only account pages.

## Requirements

- Customer routes require role `customer`.
- Admin sessions cannot access customer balance route.
- Customer sessions cannot access admin routes.
- Customer data loads from session identity.

## Scope

Included: route guards and session identity enforcement.

Excluded: customer id route parameters for authenticated customer data.

## Files Created/Modified

- `middleware/auth.js`
- `routes/customer.js`
- `tests/customer-portal.test.js`

## Routes/Models/Views Involved

- `GET /customer/balance`
- `GET /customer/package-history`
- `GET /customer/delivery-history`

## Testing Evidence

- Unauthenticated customer route redirect.
- Admin session rejected from customer route.
- Customer session rejected from admin route.

## Delivered Output

Server-side customer/admin separation.

## Notes/Concerns

Shared token routes are separate read-only routes.
