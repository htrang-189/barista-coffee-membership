# Story 1.3: Customer Session Management

## Business Objective

Enable customers to stay authenticated while using the portal so the application can provide a stable, secure, and repeatable self-service experience. The business needs this capability because a customer portal is only useful if the customer can move from screen to screen without repeatedly re-authenticating, while still keeping their account access controlled and revocable.

## Epic Objective

Establish the customer access and authentication layer for the portal in a way that supports secure, session-based use of customer-facing features. This epic ensures the portal can recognize an authenticated customer, enforce route protection, and support clean session termination.

## Story Objective

Implement customer session management so that a customer session is created after login, persists across portal navigation, protects customer-only routes, and is fully destroyed on logout.

## User Value

The customer receives a usable portal experience rather than a one-time login screen. Once authenticated, the customer can access protected balance and portal views without repeated sign-ins. This reduces friction, increases confidence that the portal is secure, and gives the customer a clear way to end the session when finished.

## Acceptance Criteria

1. A valid customer login creates an authenticated customer session.
2. The authenticated session is maintained as the customer navigates the portal.
3. Customer-only routes require a valid customer session.
4. Unauthorized requests are redirected to the customer login flow.
5. Logout destroys the active customer session.
6. Protected routes are unavailable again after logout until the customer signs in again.
7. Customer session behavior remains separate from owner authentication behavior.
8. Automated tests verify login, logout, route protection, and unauthorized access handling.

## Dependencies

- Existing customer account records and login credential support
- Session middleware available in the Express application
- Customer login flow from the prior authentication story
- Customer-only route structure in the portal
- Middleware-based access control pattern already present in the application

## Risks

- Session handling could be implemented too loosely, allowing access leakage between customer and owner experiences.
- Protected routes could be inconsistently guarded if access control is not centralized.
- Logout might only change the UI state and not fully invalidate the server session.
- The portal could rely on login-only behavior without durable authenticated state, making navigation brittle.
- Tests could miss unauthorized-access scenarios if they only cover successful login.

## Priority

High. This story is foundational for the customer portal because every meaningful customer-facing experience depends on an authenticated session boundary.

## Success Metrics

- Customers can log in once and continue using the portal without repeated prompts.
- Protected customer pages are not accessible without authentication.
- Logout reliably ends the session and revokes access.
- Customer and owner access remain clearly separated.
- Automated tests cover the full session lifecycle and access-control behavior.
