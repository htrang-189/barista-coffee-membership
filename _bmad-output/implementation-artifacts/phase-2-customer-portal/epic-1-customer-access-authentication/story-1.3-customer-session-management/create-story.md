# Story 1.3: Customer Session Management

## Story Title

Customer Session Management

## Business Context

The customer portal cannot function as a practical self-service channel unless a customer can remain authenticated while moving through the application. A login event by itself is not enough. Customers need a secure session boundary that allows them to view their balance, review history, and continue using the portal without repeatedly re-entering credentials on every page transition.

This story supports the broader customer portal objective of turning one-time access into a usable recurring experience. It also protects the separation between customer and owner access by ensuring the customer portal has its own authenticated session state and termination behavior.

## User Story

As a customer, I want my portal login to create a secure session so that I can move through the customer portal without logging in again on every page, and so that I can sign out cleanly when I finish.

## Acceptance Criteria

1. When a customer logs in successfully, the application creates a customer session.
2. The customer session persists while the customer navigates through the portal.
3. Protected customer routes are accessible only when a valid customer session exists.
4. Requests without an active customer session are redirected to the customer login flow.
5. Logging out fully terminates the customer session.
6. After logout, protected customer routes are no longer accessible until the customer logs in again.
7. Customer session behavior remains separate from owner authentication behavior.
8. Session handling is covered by automated tests.

## Functional Requirements

1. The system shall create a customer-authenticated session after valid login credentials are submitted.
2. The system shall store the minimum required customer identity in the session to identify the logged-in customer.
3. The system shall allow authenticated customers to remain signed in across portal page transitions.
4. The system shall protect customer-only routes using session-based access control.
5. The system shall redirect unauthenticated requests to the customer login page.
6. The system shall destroy the customer session on logout.
7. The system shall prevent the logout action from leaving stale authenticated state in the browser session.
8. The system shall maintain a clear separation between customer access and owner access logic.

## Non-Functional Requirements

1. Session behavior shall be secure and resistant to unauthorized access.
2. Session state shall be consistent across page requests.
3. The implementation shall be maintainable and align with the existing Express route structure.
4. The implementation shall avoid introducing unnecessary persistence or session complexity.
5. The login and logout flow shall be responsive and predictable for the customer.
6. The solution shall be testable through automated route and session tests.

## UI Requirements

1. The customer login page shall remain the primary entry point into the customer portal.
2. Authenticated customers shall be redirected into the portal experience after successful login.
3. Logout shall be available as a clear action in the customer portal experience.
4. When a customer is not authenticated, the application shall direct them back to the login experience rather than displaying protected content.
5. The UI shall not expose owner session behavior to customer users.

## Database Requirements

1. No new persistent session table is required for this story.
2. Customer account records must continue to support authentication and identity lookup.
3. Any session state used by the application shall be held outside the SQLite domain or through existing session middleware.
4. The story shall not alter the customer schema unless required by existing authentication support.

## Technical Notes

1. Customer session management is implemented as a session boundary, not as a presentation-only redirect.
2. Customer login verification should reuse the existing customer account authentication logic.
3. Route protection should be applied consistently through middleware rather than duplicated in each route handler.
4. Logout must destroy the active customer session and clear any related browser session cookie state.
5. Customer access must remain isolated from owner access in both middleware and routing behavior.
6. The session contract should remain minimal and should store only what is necessary to identify the customer.

## Testing Requirements

1. Verify that valid customer credentials establish a session.
2. Verify that invalid credentials do not establish a session.
3. Verify that protected customer routes reject unauthenticated requests.
4. Verify that protected customer routes reject requests with the wrong session role.
5. Verify that logout destroys the active customer session.
6. Verify that protected routes are inaccessible after logout.
7. Verify that the customer session behavior does not interfere with owner access behavior.

## Definition of DoD

The story is complete when:

1. Customer login creates a durable session used by the portal.
2. Customer-only routes enforce access control through that session.
3. Logout fully terminates the customer session.
4. Customer and owner access boundaries remain separate.
5. Automated tests cover login, route protection, logout, and unauthorized access behavior.
6. The delivered implementation matches the completed application behavior used as the source of truth.
