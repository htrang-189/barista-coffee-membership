# Story 1.3: Customer Session Management

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `Updated Plan`

Status: Reconstructed retrospective change-control artifact

## Correct-Course Purpose

This artifact documents how the implementation plan changed once the customer portal was treated as a real authenticated session boundary rather than a simple post-login redirect. The delivered solution confirms that the story needed to include session creation, route protection, logout invalidation, and explicit separation from owner access.

## Original Assumption

The original assumption may have been that customer login could be handled as a lightweight redirect flow: validate credentials, send the customer to the portal, and rely on page visibility alone to imply authenticated state.

That assumption was incomplete for a portal that must protect account data and preserve customer identity across navigation.

## Issue Or Change Trigger

The change trigger was the need to keep customer access durable and secure beyond the login page.

Once customers move through protected portal screens, the application must retain and validate their identity on every request. It also must ensure that logout actually ends access and that the customer experience remains distinct from owner access behavior.

## Problem Discovered

The original assumption was too narrow in four important ways:

1. it treated login as a single redirect event rather than a session lifecycle
2. it did not explicitly define how protected customer routes would be enforced
3. it did not clearly separate customer session behavior from owner authentication behavior
4. it did not fully define logout as a security boundary action

Without those elements, the portal would have appeared to work but would not have had a complete access-control model.

## Root Cause

The root cause was framing the story around credential entry instead of customer portal state.

The actual business requirement is not merely "let the customer log in." It is "keep the customer authenticated while they use the portal and revoke access when they leave." That requires a real session model.

## Decision Taken

The plan was updated to implement customer session management as a first-class portal capability.

The delivered plan became:

- verify the customer’s credentials
- create a customer session on success
- use middleware to protect customer-only routes
- redirect unauthenticated or wrong-role requests back to login
- destroy the session on logout
- keep customer access separate from owner access

## Business Rationale

The customer portal only delivers value if the customer can move through balance, history, and related views without repeated re-authentication.

Session management is therefore not a technical embellishment. It is the mechanism that makes the portal usable, secure, and trustworthy for customers.

## Technical Rationale

The completed application shows that the correct technical design is middleware-driven session control:

- the customer account model owns credential verification
- the route layer owns login, logout, and page delivery
- middleware owns access enforcement
- session destruction is the definitive logout action

This creates a clear separation of concerns and avoids embedding access checks in templates or repeating logic across routes.

## Updated Implementation Plan

The corrected implementation plan became:

1. authenticate the customer using the existing customer account data
2. create a session containing the authenticated customer identity
3. allow portal routes to trust the session boundary
4. reject unauthorized or wrong-role requests consistently
5. add a logout action that destroys the session
6. test the entire lifecycle, not just the successful login path

## Impact On Architecture

The architecture was strengthened by formalizing the customer portal as a session-based area of the application.

That change improves maintainability because future portal features can assume a single, consistent access-control model. It also reduces the risk of ad hoc security logic appearing in individual views or route handlers.

## Impact On Future Stories

This correction establishes the foundation for all later customer-facing work.

Future balance, history, purchase, notification, and profile features can rely on the presence of a validated customer session. That reduces duplication, makes routes safer by default, and keeps new features consistent with the portal’s security model.

## Impact On UI

The user interface itself did not need a major redesign, but the meaning of the UI changed.

The login page is now the entry point into an authenticated session, not just a one-off form. The logout control is now a session-termination action, not just a navigation affordance. Protected portal views only render after the session is verified.

## Impact On Data / Logic

No new persistent session table was required.

The important data and logic change was that the application now stores the authenticated customer identity in session state after credential verification. That keeps the SQLite schema stable while still giving the portal a reliable access boundary.

## Impact On Testing

The test plan had to expand beyond basic authentication success.

The corrected test scope includes:

- login success creates a session
- login failure does not create a session
- protected routes reject unauthenticated access
- protected routes reject wrong-role access
- logout invalidates access
- session state does not leak into owner behavior

## Lessons From The Adjustment

1. Portal authentication is a lifecycle, not a single request.
2. A secure customer experience requires route protection, not only credential checks.
3. Logout must destroy access, not just change screens.
4. Customer and owner session behavior should stay distinct from the start.
5. Testing must cover access control boundaries, not only successful login.

## Final Outcome

The delivered implementation reflects the corrected plan:

- customer login creates a session
- protected routes require that session
- logout ends the session
- customer access remains separate from owner access

That is the correct final interpretation of Story 1.3 in the completed customer portal.
