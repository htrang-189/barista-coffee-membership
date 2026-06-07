# Story 3.2: Add Customer Search, Detail, And Validation Coverage

Phase: Phase 1: Owner MVP

Epic: Epic 3: Customer Management

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 3.2 was to make the customer management capability reliable enough for daily owner use by ensuring that the list, search, detail, and validation behaviors around customer accounts are accurate, predictable, and resistant to data-entry mistakes. The owner must be able to find the right customer quickly, trust the details shown on the customer record, and avoid creating ambiguous or unusable customer entries.

This matters because customer management is not a decorative admin screen. It is the identity foundation for the prepaid membership ledger. If the owner cannot search efficiently or if validation rules are weak, then the same customer account can be entered twice, selected incorrectly, or used inconsistently when later package purchases and deliveries are recorded. Story 3.2 therefore exists to protect the customer ledger from operational error.

The completed application confirms the business need. The current app supports customer search by name, phone, and login identifier; renders a customer detail page with the owner-relevant account snapshot; and enforces duplicate and required-field validation in the customer creation workflow. Those behaviors are the exact operational safeguards this story was meant to formalize.

## Epic Objective

Epic 3: Customer Management exists to give the owner a trustworthy customer ledger. The epic objective is to make customer records easy to create, easy to find, and safe to reuse as the foundation for later package, delivery, portal, and balance-link workflows.

Within the epic, Story 3.2 focuses on the supporting quality behaviors that make customer management dependable in practice:

- search by the owner’s common identity fields
- detail page presentation that gives the owner a clear account snapshot
- validation and duplicate-prevention coverage
- stable handling of missing or invalid customer inputs
- route-level and model-level confidence around customer record quality

This story does not introduce a new customer business process. It ensures the customer-management process already delivered in Story 3.1 is usable and safe at real shop speed.

## Story Objective

The objective of Story 3.2 was to add the validation and coverage needed to make the customer management experience dependable and predictable.

Using the delivered application as the source of truth, this includes:

- search customers by name, phone, or login identifier
- provide a customer detail page at `/admin/customers/:customerId`
- preserve duplicate prevention for phone and login identifier
- preserve required-field validation for name, phone, login identifier, and password
- surface clear owner-facing messages when data conflicts occur
- provide automated coverage that proves the customer-management workflow behaves correctly

This story is about making the customer-management capability trustworthy enough to serve as the ledger foundation for the rest of the application.

## User Value

The primary user is the coffee shop owner.

The owner benefits because customer records become easier to find and safer to maintain. During a normal shop day, the owner should not have to remember database identifiers or manually sort through ambiguous records. Search reduces that friction. Validation reduces the chance of entering an unusable or duplicate record. The detail page gives the owner a stable place to confirm they are working with the right customer before later purchase or delivery actions are taken.

There is also indirect value to the customer. Reliable search and strict validation reduce the chance that the owner attaches package purchases or cup deliveries to the wrong account. In a prepaid membership model, data accuracy is part of the customer experience even when the customer is not yet self-serving.

For the product itself, this story converts customer management from a working feature into a dependable business capability. That is the difference between a form that exists and a ledger that can be trusted.

## Acceptance Criteria

1. The application must support searching customer records by name, phone, and login identifier.
2. The customer list and search results must return stable, predictable owner-facing results.
3. The application must provide a customer detail page at `GET /admin/customers/:customerId`.
4. The customer detail page must display the customer’s operational identity and current balance context.
5. The customer detail page must be protected by owner authentication.
6. Creating a customer must reject duplicate phone numbers.
7. Creating a customer must reject duplicate login identifiers.
8. Creating a customer must require a name.
9. Creating a customer must require a phone number.
10. Creating a customer must require a login identifier.
11. Creating a customer must require a password.
12. Creating a customer must allow an optional email address.
13. Duplicate and validation failures must be presented to the owner in clear business language.
14. Customer search and detail behavior must be covered by automated tests.
15. Customer record handling must remain suitable for later package, delivery, and portal workflows.

## Dependencies

Story 3.2 depended on earlier Phase 1 work and on the customer account capability from Story 3.1 being in place.

Prerequisite dependencies:

- Story 1.1: Build Local Express And SQLite Foundation
- Story 1.2: Establish Configuration, Data Access, And Test Foundation
- Story 2.1: Implement Owner Authentication And Route Protection
- Story 3.1: Implement Customer Account Management

Technical dependencies:

- `models/customer-account.js`
- `searchCustomers(...)`
- `findCustomerById(...)`
- `createCustomerAccount(...)`
- owner-protected admin routes
- SQLite customer records with identity and balance fields

Downstream dependencies:

- package purchase story planning and implementation
- delivery recording and voiding
- customer portal and shared balance-link flows
- any future account validation hardening

## Risks

### Risk 1: Customer records become hard to locate in daily operation

If search is not reliable across the fields the owner actually uses, the admin portal becomes slow and frustrating, especially during busy shop hours.

### Risk 2: Duplicate or invalid customer entries corrupt the ledger

If duplicate phone numbers or login identifiers are allowed, the owner can attach future membership activity to the wrong customer or be unable to distinguish records later.

### Risk 3: The detail page becomes an empty shell

If the customer detail page does not give the owner a trustworthy account snapshot, it cannot function as the operational handoff point for purchases, deliveries, and balance-link actions.

### Risk 4: Validation is handled only in the UI

If the logic is not enforced in the model or route layer, invalid data could still be written through another code path.

### Risk 5: Coverage is too shallow to protect the ledger

If tests only cover success cases, the project could still regress on duplicate prevention, missing fields, or protected access.

## Risk Mitigation Approach

The delivered application shows that the intended mitigation strategy was to keep the customer account model authoritative and to test the important failure cases explicitly.

- Search is implemented in the model so it can operate on the same data that the owner uses in the admin list.
- Duplicate checks are performed before insert.
- Required fields are enforced before writing to the database.
- The detail page shows the owner the customer’s identity and current balance in one place.
- Automated tests cover creation, duplicates, search, and protected-route behavior.

That combination is the correct mitigation pattern for a ledger-backed customer-management feature.

## Priority

Priority: Medium to High

Story 3.2 is not the first customer-management capability, but it is important because it closes the loop on correctness and operational usability. It is high enough to matter because the owner’s trust in the ledger depends on being able to find and validate records quickly, but it is slightly below the initial creation story because the core customer account structure already exists once Story 3.1 is delivered.

## Success Metrics

The story is successful when the owner can reliably find and confirm customer records and the system consistently rejects bad identity data.

Business-capability success metrics:

- customer search returns the expected record when queried by name, phone, or login identifier
- the owner can open a customer detail page for the correct record
- invalid customer submissions are rejected before they pollute the ledger

Data-quality success metrics:

- duplicate phone numbers are blocked
- duplicate login identifiers are blocked
- required fields are enforced consistently
- customer detail data remains stable and accurate for later workflow stages

Delivered evidence in the current application includes:

- `models/customer-account.js`
- `routes/admin.js`
- customer-management tests in `tests/phase1-owner.test.js`
- broader owner/customer integration coverage in `tests/e2e-owner-customer-flow.test.js`

## Success Criteria Traceability To Delivered Application

The reconstructed story planning maps to the delivered implementation as follows:

Implemented evidence:

- `models/customer-account.js`
  - `searchCustomers(...)`
  - `findCustomerById(...)`
  - `createCustomerAccount(...)`
- `routes/admin.js`
  - `GET /admin/customers`
  - `GET /admin/customers/new`
  - `POST /admin/customers`
  - `GET /admin/customers/:customerId`
- `tests/phase1-owner.test.js`
  - duplicate phone rejection
  - duplicate login identifier rejection
  - customer search behavior
  - protected customer-management access
- `tests/e2e-owner-customer-flow.test.js`
  - customer creation and subsequent owner workflow linkage

The current application therefore confirms that Story 3.2 was not a separate product feature. It was the validation and reliability layer that made the customer-management capability operationally trustworthy.
