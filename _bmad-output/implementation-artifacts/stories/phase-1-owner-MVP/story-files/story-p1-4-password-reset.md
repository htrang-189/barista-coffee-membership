# Story P1-4: Owner-Managed Customer Password Reset

Status: Implemented
Phase: Phase 1 Owner/Admin Portal

## Objective

Allow the owner to reset a customer's forgotten password from the admin portal.

## Requirements

- Admin-only reset action on customer detail.
- Owner sets a new temporary password.
- New password is hashed with existing password helper.
- Raw password is never stored.
- Old password stops working.
- New password works.
- Customer cannot reset password themselves.
- No email, SMS, or automated forgot-password flow.

## Scope

Included: reset form, admin POST route, model password update, tests.

Excluded: customer portal reset UI, email/SMS, forgot-password automation.

## Files Created/Modified

- `models/customer-account.js`
- `routes/admin.js`
- `tests/customer-portal.test.js`

## Routes/Models/Views Involved

- `POST /admin/customers/:customerId/password-reset`
- `GET /admin/customers/:customerId`
- `resetCustomerPassword()`

## Testing Evidence

- Admin reset test.
- Old password rejected.
- New password accepted.
- Raw password not stored.
- Non-admin reset blocked.

## Delivered Output

Owner-managed password reset workflow.

## Notes/Concerns

Temporary passwords must be shared securely outside the app.
