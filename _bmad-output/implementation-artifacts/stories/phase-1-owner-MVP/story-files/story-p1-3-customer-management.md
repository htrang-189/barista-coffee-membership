# Story P1-3: Customer Management

Status: Implemented
Phase: Phase 1 Owner/Admin Portal

## Objective

Allow the owner to create, search, list, and view customer accounts.

## Requirements

- Customer name, phone, login identifier, and password are required.
- Email is optional.
- Duplicate phone and login identifier are blocked.
- Customer list/search supports name, phone, and login identifier.
- Customer detail shows account and balance information.

## Scope

Included: customer model, add form, duplicate handling, list/search, detail page.

Excluded: customer self-service mutations.

## Files Created/Modified

- `models/customer-account.js`
- `routes/admin.js`
- `database/schema.sql`
- `tests/phase1-owner.test.js`

## Routes/Models/Views Involved

- `GET /admin/customers`
- `GET /admin/customers/new`
- `POST /admin/customers`
- `GET /admin/customers/:customerId`
- `models/customer-account.js`

## Testing Evidence

- Customer creation test.
- Duplicate phone test.
- Duplicate login identifier test.
- Search test.
- Protected route test.

## Delivered Output

Owner customer management workflow.

## Notes/Concerns

Customer account creation also prepares customer login credentials for Phase 2.
