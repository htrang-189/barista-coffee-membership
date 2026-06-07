# Development Objective

The objective of Story 3.2 was to harden the customer-management ledger so the owner can search customers reliably, open a stable customer detail page, and depend on duplicate and required-field validation to prevent bad records from entering the system. In the delivered application, this story acts as the reliability layer for the customer record that Story 3.1 introduced. It does not create a new business surface; it makes the existing customer ledger safe to operate.

## Files Created

### No new implementation-only model or route file was created

This story is primarily a hardening and validation story. The delivered implementation extends the customer-account model and existing admin routes rather than introducing a brand-new domain file. That is consistent with the way the application already organizes customer data.

### Test additions and coverage in existing test files

The story’s implementation evidence is primarily expressed through automated coverage in the project’s existing customer and owner workflow test files.

Why this exists:

- The purpose of the story is to verify and protect behavior that already exists in the customer ledger.

What problem it solves:

- It ensures the search, detail, and validation behavior can be proven and defended against regression.

How it works:

- The tests build isolated SQLite contexts, create owner and customer records, and assert the correct customer-search and validation behavior through the actual application interfaces.

## Files Modified

### `models/customer-account.js`

This is the central model file for customer validation and search behavior.

Why it exists:

- The customer ledger needs a canonical place to enforce required fields, duplicate detection, search logic, and lookup functions.

What problem it solves:

- Without this file carrying the customer rules, the admin routes would become too dependent on SQL scattered across handlers.
- It also avoids inconsistent validation across different entry points.

How it works:

- `normalizeCustomerInput(...)` trims and normalizes owner input.
- `createCustomerAccount(...)` enforces required fields and duplicate rules.
- `searchCustomers(...)` queries customers by name, phone, and login identifier.
- `findCustomerById(...)` provides the stable detail lookup used by the admin UI.

This file is the practical core of the story because it implements the reliability rules that make customer management trustworthy.

### `routes/admin.js`

This file was extended to render the search and detail experience cleanly from the owner portal.

Why it exists:

- The owner needs to interact with search, list, create, and detail behavior in the admin UI.

What problem it solves:

- It exposes the model logic through actual owner-facing routes and screens.

How it works:

- `GET /admin/customers` reads the `q` query parameter and passes it to the customer search model.
- `GET /admin/customers/:customerId` renders the customer detail page for an existing customer.
- `POST /admin/customers` handles validation failures and duplicate failures with owner-readable messages.
- All customer-management routes remain behind owner authentication.

The route layer keeps the operational presentation simple while relying on the model layer for the actual data rules.

### `tests/phase1-owner.test.js`

This file contains the core customer-management regression checks used by the delivered application.

Why it exists:

- Customer-search and validation behavior must remain stable because they protect the integrity of the membership ledger.

What problem it solves:

- It proves the owner can search customers and that invalid or duplicate customer input is rejected before the database changes.

How it works:

- The tests create a temporary SQLite database, apply the schema, seed the owner, and then exercise the customer model and protected admin routes.

### `tests/e2e-owner-customer-flow.test.js`

This file extends the validation and search evidence into a broader owner workflow path.

Why it exists:

- Customer management is part of the owner’s overall ledger workflow, not a standalone isolated feature.

What problem it solves:

- It validates that customer records can be created and then used in a real owner session.

How it works:

- The tests authenticate as the owner, create customer data through the application path, and continue through related owner interactions.

## Database Changes

### No schema change was introduced by this story

That is correct because the database structure for customer records already existed from the customer-management story.

Why it exists:

- The story is about improving behavior and coverage, not reshaping the customer table.

What problem it solves:

- It avoids unnecessary schema churn in the middle of the MVP.

How it works:

- The existing customer record fields are reused as the source of truth.
- Search and validation logic operate against the current SQLite schema and customer rows.

### Existing database fields used by this story

- `name`
- `phone`
- `email`
- `login_identifier`
- `password_hash`
- `balance_access_token`
- `current_balance`

These fields are enough to support the reliable search, detail, and validation behavior needed by the story.

## Routes Added

### No new route namespace was introduced

The story continues to use the existing admin route namespace.

### Existing routes exercised or enhanced

- `GET /admin/customers`
- `GET /admin/customers/new`
- `POST /admin/customers`
- `GET /admin/customers/:customerId`

Why they exist:

- The owner needs a searchable customer index.
- The owner needs a detail page for the correct account.
- The owner needs the create route to reject bad or duplicate input safely.

How they work:

- Search results are derived from the `q` query parameter.
- The detail page is rendered from the existing customer record.
- Create failures are rendered back into the form with business-readable errors.

## Models Added

### No new model file was added by this story

The story reuses the existing `models/customer-account.js` file and strengthens its behavior.

### Existing model functions used by the story

- `searchCustomers(...)`
- `findCustomerById(...)`
- `createCustomerAccount(...)`
- `findCustomerByPhone(...)`
- `findCustomerByLoginIdentifier(...)`

Why they exist:

- Customer search, detail, and validation all depend on the same customer ledger model.

What problem they solve:

- They prevent the customer-management logic from being duplicated across route handlers.

How they work:

- Search and lookup functions operate directly on SQLite customer rows.
- Validation functions reject bad data before insert.
- Duplicate checks ensure the ledger remains unique and trustworthy.

## UI Components Added

### Customer list search row

Why it exists:

- The owner needs to find customers by common identity fields quickly.

What problem it solves:

- It avoids slow or manual searching through the customer ledger.

How it works:

- A search input on the customer list page accepts the lookup term and submits it through the existing admin route.

### Customer detail page

Why it exists:

- The owner needs one stable place to verify the customer identity and current balance.

What problem it solves:

- It prevents ambiguity when the owner is later recording purchases or deliveries.

How it works:

- The page displays the core account snapshot directly from the customer record.

### Validation error display

Why it exists:

- The owner needs to understand why a customer record was rejected.

What problem it solves:

- It reduces the risk of repeated invalid submissions or hidden data failures.

How it works:

- Duplicate or invalid input re-renders the add-customer form with a visible error box and retained field values.

## Business Logic Implemented

### Customer search behavior

Why it exists:

- The owner needs to retrieve customer records by the fields they actually know.

What problem it solves:

- It keeps the customer ledger usable during normal shop operations.

How it works:

- `searchCustomers(...)` supports queries against name, phone, and login identifier.
- The customer list is rendered from the model results.

### Detail page stability

Why it exists:

- The owner needs a consistent account snapshot when working with a customer record.

What problem it solves:

- It provides a dependable anchor for later workflows.

How it works:

- The detail route fetches the customer by id and renders the current identity and balance data.

### Duplicate prevention

Why it exists:

- Phone numbers and login identifiers must remain unique.

What problem it solves:

- It prevents customer identity conflicts in the membership ledger.

How it works:

- `createCustomerAccount(...)` checks for existing phone and login identifier values before inserting a new customer.

### Required-field validation

Why it exists:

- Customer records must be complete enough to support later account workflows.

What problem it solves:

- It prevents unusable or partial ledger entries.

How it works:

- The model requires name, phone, login identifier, and password.
- Email remains optional.

## Validation Rules

The validation rules verified by the story are:

1. Name is required.
2. Phone is required.
3. Login identifier is required.
4. Password is required.
5. Email is optional.
6. Phone must be unique.
7. Login identifier must be unique.

Why they exist:

- These are the minimum business rules for a durable customer ledger record.

What problem they solve:

- They prevent duplicate, incomplete, or ambiguous customer records from entering the database.

How they work:

- The model performs the checks before insert and raises business-specific errors when a rule is violated.

## Security Controls

This story reuses and depends on existing security controls rather than adding new ones.

1. Customer-management routes remain owner-only.
2. Customer passwords are stored as hashes.
3. The customer detail page remains inside the protected admin portal.
4. Validation occurs on the server side, not just in the browser.

Why they exist:

- Customer identity data and credentials should not be exposed or stored carelessly.

What problem they solve:

- They prevent unauthorized access and protect the ledger from invalid writes.

How it works:

- The admin routes enforce owner authentication.
- The model hashes passwords and rejects invalid data before database insert.

## Test Coverage

The delivered Story 3.2 implementation is covered by tests that prove:

1. Customer search returns expected matches.
2. Customer detail pages render for existing customers.
3. Duplicate phone numbers are rejected.
4. Duplicate login identifiers are rejected.
5. Missing required fields are rejected.
6. Protected customer-management routes stay owner-only.
7. Customer-ledger behavior remains stable in broader owner workflows.

Why the tests exist:

- The story is about keeping the customer ledger trustworthy.

What problem it solves:

- It gives the team confidence that search, detail, and validation changes will not silently break the customer-management foundation.

How it works:

- Tests run against isolated SQLite databases.
- They exercise the real application routes and model functions.
- They verify both success and failure behavior, which is essential for validation coverage.

The test coverage is appropriately scoped for the story because it protects the most important business rules without drifting into package, delivery, or portal logic.
