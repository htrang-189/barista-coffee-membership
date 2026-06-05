# Story P2-1: Customer Authentication

Status: Implemented
Phase: Phase 2 Customer Portal

## Objective

Allow customers to log in and out with owner-created customer credentials.

## Requirements

- Customer login page.
- Valid login creates customer session.
- Invalid login shows generic error.
- Logout clears customer session.
- Existing customer password hash is used.

## Scope

Included: customer auth route, login view, session role.

Excluded: self-service password reset.

## Files Created/Modified

- `routes/customer.js`
- `views/shared/customer-login.html`
- `models/customer-account.js`
- `tests/customer-portal.test.js`

## Routes/Models/Views Involved

- `GET /customer/login`
- `POST /customer/login`
- `POST /customer/logout`
- `authenticateCustomer()`

## Testing Evidence

- Customer login success/failure.
- Customer logout.

## Delivered Output

Customer login/logout flow.

## Notes/Concerns

Forgotten passwords are reset by owner from admin portal.
