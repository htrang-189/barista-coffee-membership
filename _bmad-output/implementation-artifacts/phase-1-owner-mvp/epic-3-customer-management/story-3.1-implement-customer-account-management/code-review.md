# Findings

## Architecture Compliance

The implementation of Story 3.1 is aligned with the established application architecture. Customer management is implemented within the existing Express admin route namespace, uses the SQLite-backed model layer, and relies on the owner-authentication boundary already delivered in Phase 1. No separate service, subsystem, or alternate persistence path was introduced. That is correct for this MVP.

The model-driven design is also consistent with the broader codebase. Customer creation, search, and lookup are encapsulated in `models/customer-account.js` rather than being embedded in route handlers. This keeps the routes thin and preserves the architectural separation the project has used elsewhere for passwords, admin users, package purchases, and delivery history.

The use of `balance_access_token` and `current_balance` in the customer record is also architecture-compliant because the customer account is intended to be the source of truth for later portal and balance-link workflows. The customer record is not a disposable form payload; it is a ledger anchor. The implementation reflects that correctly.

## Coding Standards

The code is clear and maintainable. Function names are descriptive, the model file contains focused helpers, and route handlers are structured around one business action each. The implementation avoids over-abstraction while still separating concerns appropriately.

Positive coding-standard observations:

1. Input normalization is centralized.
2. SQL access is wrapped in helper functions rather than repeated inline.
3. Duplicate-prevention behavior uses explicit business errors, which makes route handling readable.
4. The customer list and detail routes follow the same existing admin rendering conventions used elsewhere in the application.

The customer model is one of the cleaner files in the delivered application because it is business-oriented rather than framework-noisy. That is a good fit for the project.

## Security

Story 3.1 handles security appropriately for an owner-managed customer ledger.

Verified strengths:

1. The customer-management routes are protected by the existing owner authentication middleware.
2. Customer passwords are hashed before storage through the shared password helper.
3. The customer record includes a balance access token, but it is not exposed as a public customer portal feature yet.
4. Duplicate phone and login identifier checks reduce the risk of identity confusion or accidental misuse.

The customer detail page shows sensitive operational information only inside the authenticated admin portal, which is correct for the current phase. No public exposure was introduced.

One limitation is that customer-management security is only as strong as the owner-authentication layer it depends on. That is acceptable for this story because Story 2.1 already established the auth boundary. The dependency chain is correct, but future changes to auth middleware should preserve this assumption.

## Validation

The implementation validates the important business fields before creating a customer record.

Key validation behaviors:

1. Name is required.
2. Phone is required.
3. Login identifier is required.
4. Password is required.
5. Email remains optional.
6. Duplicate phone numbers are rejected.
7. Duplicate login identifiers are rejected.
8. Search terms are trimmed and normalized before use.

This validation set is appropriate for the story because it protects the core record identity while keeping the UI simple. The owner sees business-friendly error messages instead of raw database failures, which is the right behavior for an operational admin tool.

## Database Integrity

Database integrity is a strong point of this implementation.

Positive observations:

1. Customer records are written once and retrieved through consistent model functions.
2. Duplicate prevention happens before insert, reducing avoidable database conflicts.
3. Password hashes are stored instead of plaintext values.
4. Current balance is initialized to zero and maintained as a field on the customer record.
5. `balance_access_token` is created alongside the record so later shared access can reuse the same ledger identity.

The searchable customer list also uses joined data to produce a stable operational view, including last delivery context. That supports the owner’s workflow without compromising integrity.

The main structural risk in this area is future maintenance of the customer schema because it now serves multiple downstream concerns: owner management, package purchases, deliveries, customer login, and shared balance access. However, the current implementation shows a coherent path for that shared schema, and no corruption risk was introduced by this story.

## Error Handling

Error handling is adequate and business-oriented.

1. Duplicate phone and login identifier errors are handled explicitly and re-render the form with a useful message.
2. Missing customer lookups return `404 Customer not found.` rather than failing ambiguously.
3. Model-level validation throws clear errors for missing required fields.
4. The admin route handlers use the project’s existing error flow rather than swallowing exceptions.

This is a practical implementation for a small Express app. It gives the owner meaningful feedback without trying to build an elaborate validation framework that the project does not need.

## UI Consistency

The customer-management UI fits the rest of the admin portal.

Observed consistency points:

1. The customer list follows the same admin page structure as the dashboard and other owner pages.
2. The add-customer form follows the same card-and-form layout conventions used elsewhere.
3. The customer detail page provides the identity and balance context the owner needs without introducing a separate design language.
4. Duplicate validation messages appear inline in the admin form flow, which is consistent with the rest of the application’s owner-facing interactions.

The UI is intentionally utilitarian. That is appropriate for a small coffee shop operational tool. There is no unnecessary visual complexity.

## Test Coverage

The customer-management story is backed by meaningful automated coverage.

Covered behavior includes:

1. Customer creation succeeds with required fields.
2. Duplicate phone numbers are rejected.
3. Duplicate login identifiers are rejected.
4. Customer search returns matching records.
5. Customer-management routes remain protected by owner authentication.
6. Customer records created here can be used by later owner workflows.

The suite is strong because it verifies both model-level behavior and route protection. That combination matters for customer management, since the business risk comes from both identity data quality and access control.

The tests are not exhaustive of every possible UI permutation, but they are well matched to the story’s scope. They protect the most important business rules without drifting into unrelated customer-portal or purchase-flow concerns.

# Issues

## Low: Customer detail page coverage is lighter than the business impact of the page

The story’s implementation clearly provides a usable customer detail page, but the automated coverage described in the delivered evidence focuses more on creation, duplicates, search, and protected access than on a fully exhaustive set of detail-page assertions.

Impact:

- This does not block approval because the detail page is implemented and used in the application.
- It is a reasonable area for additional coverage if the team wants stronger regression protection around detail rendering.

## Low: Search behavior is business-adequate but not deeply specified

The search functionality works by name, phone, and login identifier, and that is sufficient for the owner workflow. However, the story does not define advanced sort/pagination behavior, and the current tests reflect that simpler scope.

Impact:

- This is appropriate for the MVP.
- It is not a defect, but it is a limit worth preserving in the documentation so the story is not mistaken for a richer CRM feature.

# Recommendations

1. Approve the implementation as delivered.
2. Preserve the customer-account model as the single source of truth for identity, password, balance, and balance-link data.
3. If future customer-management enhancements are added, expand coverage around detail-page rendering and list/search behavior before adding more UI complexity.
4. Keep duplicate prevention in the model layer, not only in route validation, because the data integrity risk is business-critical.

# Approval Decision

The implementation is architecture-compliant, secure for the current MVP scope, well-validated, and supported by sensible automated tests. It delivers exactly what the owner needs to manage customer accounts reliably without overcomplicating the product.

APPROVED
