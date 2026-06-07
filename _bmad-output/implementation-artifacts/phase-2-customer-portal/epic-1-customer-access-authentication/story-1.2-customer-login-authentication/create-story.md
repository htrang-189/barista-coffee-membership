# Story 1.2: Customer Login Authentication

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `story-[slug].md`

Status: Reconstructed retrospective implementation story

## Story Title

Customer Login Authentication

## Business Context

The Barista Coffee Membership application already supports secure customer access links, but customers also need a direct login path that uses their own credentials. A tokenized link is useful for sharing balance access, yet a real customer portal should also support a normal authenticated session so the customer can return later and access their membership information in a controlled way.

The completed application shows that this story is the session-based authentication boundary for the customer portal. It gives the customer a familiar login/logout flow while preserving the separation between customer and owner experiences.

## User Story

As a customer, I want to log in with my own credentials so that I can securely access my membership balance and customer portal features through a persistent session.

## Acceptance Criteria

1. The customer can open a login page and submit credentials.
2. Valid customer credentials create a customer session.
3. Successful login redirects the customer to the balance page.
4. Invalid credentials are rejected with a generic error message.
5. The customer can log out and clear the session.
6. Customer routes require a valid customer session.
7. Expired or missing customer sessions redirect to the customer login page.
8. The admin session cannot be used to access customer-only routes.
9. The customer session is distinct from the owner session.
10. Automated tests verify login, logout, and route protection.

## Functional Requirements

The application must render a customer login form.

The application must accept a customer login identifier and password.

The application must authenticate the submitted credentials against the stored customer password hash.

The application must create a customer session on successful login.

The application must redirect a successful login to the customer balance page.

The application must reject invalid credentials with a generic error message.

The application must allow the customer to log out and destroy the session.

The application must require a valid customer session for customer-only routes.

The application must redirect missing or expired customer sessions to the customer login page.

The application must prevent the owner/admin session from being reused as a customer session.

## Non-Functional Requirements

The login flow must be secure and deterministic.

The login flow must use the existing server-rendered application architecture.

The customer session must be isolated from the admin session.

The logout process must fully clear access, not merely hide the UI.

The implementation must be testable at both route and end-to-end levels.

The login experience should be simple and familiar, without unnecessary complexity.

## UI Requirements

The customer login page must be straightforward and easy to use.

The login form must clearly ask for the customer login identifier and password.

The page must display a generic error when authentication fails.

The successful login target must be the customer balance page.

The logout action must be available from the customer portal session context.

The UI must remain consistent with the Barista customer portal styling.

## Database Requirements

The login flow must use the existing customer account record as the source of truth.

The customer record must already contain the login identifier and password hash.

The implementation does not require a new schema for session data because session state is managed separately from the SQLite customer tables.

The customer record must remain the source of identity for customer authentication.

## Technical Notes

The delivered application shows that customer login authentication is implemented in the customer route layer and backed by the customer account model.

`models/customer-account.js` provides the credential verification through `authenticateCustomer(...)`.

`routes/customer.js` implements the login page, login submission, session creation, logout behavior, and customer route access patterns.

`middleware/auth.js` enforces customer-only access for customer routes and redirects missing or expired sessions to the customer login page.

The customer and owner session roles are distinct, which is essential for maintaining the portal boundary.

## Testing Requirements

Tests must verify that valid customer credentials create a session.

Tests must verify that invalid credentials are rejected generically.

Tests must verify that customer logout destroys the session.

Tests must verify that customer-only routes require a customer session.

Tests must verify that admin sessions cannot access customer-only routes.

Tests should verify that the post-login redirect lands on the customer balance page.

## Definition Of Done

The story is done when a customer can log in and log out securely, can reach the customer balance page through a customer session, and cannot use the customer portal without proper session state.

The story is not done if invalid credentials create a session, if the customer session can access owner routes, or if logout does not fully clear access.

## Expected Delivered Output

The expected delivered output is a working customer authentication flow that includes:

- customer login form
- credential verification
- customer session creation
- logout and session destruction
- customer-only route protection

The completed application confirms that Story 1.2 delivered the authentication boundary required for the Phase 2 customer portal.
