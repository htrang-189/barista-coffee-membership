# Story 1.2: Customer Login Authentication

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `Approve`

Status: Reconstructed retrospective code review

## Review Purpose

This review evaluates whether the customer login/authentication implementation is aligned with the application architecture, secure, and well covered by tests.

Because this story creates a customer session and controls access to private portal data, the review focus is on session isolation, credential validation, logout behavior, and route protection.

## Reviewed Scope

The review covered:

- `routes/customer.js`
- `models/customer-account.js`
- `middleware/auth.js`
- `views/shared/customer-login.html`
- `tests/customer-portal.test.js`
- `tests/e2e-owner-customer-flow.test.js`

## Architecture Compliance

The implementation fits the project architecture well.

Customer credential verification lives in the customer account model, which is the correct home for login logic. The route layer handles the login form, session creation, logout, and response handling. Route protection lives in middleware, which keeps the access boundary reusable and easy to understand.

The customer portal remains server-rendered and consistent with the rest of the application. There is no unnecessary client-side auth complexity.

## Coding Standards

The code follows the repository’s existing style:

- model helpers for domain logic
- route handlers that stay focused on request and response flow
- explicit middleware for route protection
- readable tests that use isolated SQLite databases and Supertest

The login and logout code is straightforward and maintainable. The generic invalid-login behavior is also implemented cleanly and consistently.

## Security Review

Security is handled appropriately for the story.

Customer credentials are verified against the stored password hash before a session is created. That is the correct baseline for password-based authentication.

Customer and owner sessions are separate. The middleware checks the session role so customer routes cannot be reached with the wrong session type.

Logout destroys the session and clears the session cookie, which is the correct behavior for ending access.

Invalid login attempts are generic and do not leak unnecessary detail. That is the right balance for a simple customer login flow.

## Validation Review

Validation is appropriate and focused on the business rules that matter:

- login identifier must identify a real customer
- password must match the stored hash
- invalid credentials must not create a session
- customer routes must reject missing or expired sessions
- admin sessions must not open customer routes

These validations are the right ones for a session-based customer portal.

## Database Integrity Review

The authentication implementation uses the existing customer record as the source of truth.

No schema change was needed, which is correct because the application already stores the login identifier and password hash on the customer account. The session itself remains outside the SQLite schema, which keeps the data model simple.

There is no sign of redundant auth storage or duplicated identity state in the database layer.

## Error Handling Review

The implementation handles auth failures appropriately.

Invalid login attempts return a generic error and do not create a session. Expired or missing sessions redirect to the customer login page. That is the right behavior for a customer portal because it gives the user a clear next step without exposing security detail.

The route handlers keep the error path simple and do not attempt to recover from failed authentication in unsafe ways.

## UI Consistency Review

The customer login page is consistent with the rest of the application.

It uses the shared server-rendered template approach and the same visual language as the rest of the customer portal. The login page is simple, focused, and functional, which is the correct UX for an authentication entry point.

The logout behavior also stays consistent with the portal’s form-based, server-rendered interactions.

## Test Coverage Review

The test coverage is strong and aligned to the risk profile of the story.

The suite covers:

- successful customer login
- failed customer login
- logout and session clearing
- customer route protection
- admin session rejection on customer routes
- post-login redirect behavior

The end-to-end coverage also ensures that the customer session works in the full application flow, not only in isolated model logic.

## Findings

1. Customer authentication is implemented in the correct model and route layers.
2. Customer and owner sessions are properly separated.
3. Logout clears access correctly.
4. Invalid login behavior is generic and safe.
5. Tests cover the core login, logout, and route protection scenarios.

## Issues

No blocking issues were identified.

The only residual risk is ordinary auth maintenance: if future customer portal features add more session-aware behavior, the same route protection rules must be preserved. That is a normal maintenance concern, not a defect in the current implementation.

## Recommendations

1. Preserve the current session-role separation in future customer portal work.
2. Keep login failures generic to avoid leaking credential details.
3. Extend tests if additional customer-authenticated routes are added later.

## Approval Decision: Approved

The implementation is architecturally clean, secure, and sufficiently covered by tests for a customer login/authentication story.

## APPROVED
