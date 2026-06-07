# Story 3.1: Implement Customer Account Management

Phase: Phase 1: Owner MVP

Epic: Epic 3: Customer Management

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 3.1 was to give the coffee shop owner a reliable way to create and maintain customer membership accounts inside the admin portal. Phase 1 is built around a prepaid cup ledger, not a loyalty program and not a separate customer-facing account system. The owner needs a single place to register a customer, store contact details, assign a login identifier for later customer access, and maintain the record that links future package purchases and cup balances to the correct customer.

In operational terms, this replaces ad hoc paper records or spreadsheet rows with structured customer accounts that the owner can search, open, and maintain from the admin interface. That matters because the rest of the membership program depends on identifying the right person before balance credits, deliveries, voids, and shared access links can be managed safely. If customer creation is weak or inconsistent, every later ledger action becomes vulnerable to misattribution.

The completed application confirms the business need was correctly framed. The current app supports customer creation with required name, phone, login identifier, and password, prevents duplicate phone and login identifier records, supports search by name/phone/login identifier, and exposes a detailed customer record page that anchors the rest of the membership workflows.

## Epic Objective

Epic 3: Customer Management exists to establish the owner’s operational customer ledger. The epic objective is to let the owner create customers once, find them again quickly, view a current account snapshot, and access the customer-specific workflows that depend on accurate account identity.

Within the epic, Story 3.1 provides the core account-management capability:

- create a customer account from the owner portal
- require a unique phone number
- require a unique login identifier
- capture optional email contact details
- capture an initial password for later customer access
- support search and discovery through the customer list
- show a customer detail page with the identifying and balance context needed for follow-on workflows

This epic is not about customer self-service yet. It is about ensuring the owner can establish and maintain the customer record cleanly enough that later purchase, delivery, and customer-portal features can trust it.

## Story Objective

The objective of Story 3.1 was to implement the owner-facing customer account management workflow end to end.

Using the delivered application as the source of truth, this includes:

- `GET /admin/customers`
- `GET /admin/customers/new`
- `POST /admin/customers`
- customer search by name, phone, or login identifier
- duplicate prevention for phone and login identifier
- customer detail access at `/admin/customers/:customerId`
- a customer account model that stores identity, contact data, login identifier, password hash, balance access token, and current balance

This story gives the owner a practical account management surface, not just a database insert form.

## User Value

The primary user is the coffee shop owner.

The owner gains a simple, dependable way to register a customer and return to that customer later without having to manage records manually in spreadsheets or paper logs. The customer list and search capability reduce operational friction during busy shop hours. The customer detail page gives the owner a single record view that becomes the anchor for all subsequent membership operations.

There is also customer value, even though the customer does not yet use the portal in this story. Correct account creation is a prerequisite for later customer login and balance sharing. If the owner can create the right record once and retrieve it reliably later, the customer experience in later phases becomes coherent and trustworthy.

For the product itself, this story turns the application from a generic admin shell into an actual customer ledger. That is the point where the MVP starts to behave like the business tool it was intended to be.

## Acceptance Criteria

1. The application must provide a customer list page at `GET /admin/customers`.
2. The customer list must be visible only to authenticated owner users.
3. The customer list must support search by name, phone, or login identifier.
4. The application must provide a customer creation page at `GET /admin/customers/new`.
5. The customer creation page must be visible only to authenticated owner users.
6. The application must provide a customer creation action at `POST /admin/customers`.
7. Creating a customer must require a name.
8. Creating a customer must require a phone number.
9. Creating a customer must require a login identifier.
10. Creating a customer must require an initial password.
11. Creating a customer must permit an optional email field.
12. Customer phone numbers must be unique.
13. Customer login identifiers must be unique.
14. Duplicate phone numbers must be rejected with a clear error message.
15. Duplicate login identifiers must be rejected with a clear error message.
16. Successful customer creation must redirect to the new customer detail page.
17. The application must provide a customer detail page at `GET /admin/customers/:customerId`.
18. The customer detail page must show the customer’s name, phone, email, login identifier, and current balance.
19. The customer detail page must be available only to authenticated owner users.
20. Customer records must be stored in the application’s SQLite database and retrieved from there for display and search.
21. Customer search results must be stable and ordered consistently for owner review.

## Dependencies

Story 3.1 depended on earlier Phase 1 foundation work and on the owner-authentication boundary being in place.

Prerequisite dependencies:

- Story 1.1: Build Local Express And SQLite Foundation
  - required the route structure, application startup, and local server shell
- Story 1.2: Establish Configuration, Data Access, And Test Foundation
  - required schema, database helpers, and test baseline
- Story 2.1: Implement Owner Authentication And Route Protection
  - required protected admin routes and authenticated owner sessions

Technical dependencies:

- `models/customer-account.js`
- `routes/admin.js`
- `searchCustomers(...)`
- `createCustomerAccount(...)`
- `findCustomerById(...)`
- `findCustomerByPhone(...)`
- `findCustomerByLoginIdentifier(...)`
- `hashPassword(...)`
- `balance_access_token` and `current_balance` fields on customer records

Downstream dependencies:

- Story 3.2: Add Customer Search, Detail, And Validation Coverage
- package purchase recording
- delivery recording and voiding
- customer portal login and balance sharing

## Risks

### Risk 1: Duplicate customer records

If the application allowed duplicate phone numbers or login identifiers, the owner could attach purchases and deliveries to the wrong customer or be unable to distinguish records later.

### Risk 2: Customer record creation is too permissive

If name, phone, or login identifier were optional, the owner could create incomplete records that would not support the later portal and ledger flows.

### Risk 3: Customer list becomes hard to search during daily operation

If the owner could not search by the most common identifying fields, the admin portal would become inefficient and less useful in real shop conditions.

### Risk 4: Customer detail data is fragmented

If the detail page did not clearly show identity and balance context, follow-on workflows would become error-prone because the owner would need to jump between pages or infer account state from hidden database data.

### Risk 5: Customer account management is treated as a one-off insert task

If the story were reduced to a basic form submission, the project would miss the fact that customer management is the foundation for nearly every later business workflow in the MVP.

## Risk Mitigation Approach

The delivered application shows the intended mitigation strategy clearly:

- `createCustomerAccount(...)` validates required fields before writing to the database.
- phone uniqueness and login identifier uniqueness are checked before insert.
- password storage is hashed through the existing password helper.
- the customer list exposes search by name, phone, and login identifier.
- the customer detail page provides the owner with the essential identity and balance context in one place.
- owner authentication protection ensures only the correct user can manage customer accounts.

This approach reduces both data-integrity risk and operational confusion.

## Priority

Priority: High

Story 3.1 is high priority because customer accounts are the source record for the rest of the membership program. Without them, package purchases, delivery history, balance sharing, and customer portal access have no trustworthy identity anchor.

The story also has sequencing importance. It should be delivered early in Phase 1 because it unlocks all customer-specific owner workflows and provides the data surface needed for later customer-facing features.

## Success Metrics

The story is successful when the owner can reliably manage customer accounts through the admin portal without falling back to manual records.

Business-capability success metrics:

- the owner can create a customer account from the admin UI
- the owner can find customer records through list search
- the owner can open a customer detail page for an existing customer
- duplicate customer identities are prevented

Data-quality success metrics:

- name, phone, login identifier, and password are enforced at creation time
- optional email is stored when provided
- customer records are stored once and retrieved consistently

Delivered evidence in the current application includes:

- `models/customer-account.js`
- `routes/admin.js`
- customer management coverage in `tests/phase1-owner.test.js`
- admin route coverage in `tests/e2e-owner-customer-flow.test.js`

## Success Criteria Traceability To Delivered Application

The reconstructed story planning maps directly to the completed application.

Implemented evidence:

- `models/customer-account.js`
  - `createCustomerAccount(...)`
  - `searchCustomers(...)`
  - `findCustomerById(...)`
  - `findCustomerByPhone(...)`
  - `findCustomerByLoginIdentifier(...)`
- `routes/admin.js`
  - `GET /admin/customers`
  - `GET /admin/customers/new`
  - `POST /admin/customers`
  - `GET /admin/customers/:customerId`
- `tests/phase1-owner.test.js`
  - customer creation
  - duplicate phone prevention
  - duplicate login identifier prevention
  - customer search
  - protected-route behavior

The current application therefore confirms that Story 3.1 was correctly framed as a customer account management capability, not merely as a form for inserting rows into a table.
