# Story 1.2: Customer Login Authentication

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `Updated Plan`

Status: Reconstructed retrospective change-control artifact

## Correct-Course Purpose

This artifact documents how the original customer login assumption evolved before implementation. Story 1.2 began as a straightforward login task, but the completed application shows that the correct solution needed a customer-specific session boundary with route protection and clean logout behavior.

## Original Assumption

The original assumption may have been that the customer login screen was just a form and a redirect. That would have been too narrow for a real customer portal because login is not only about entering credentials; it is about establishing a safe session boundary that keeps customer data isolated from the owner experience.

The delivered application shows that this story needed to be treated as the customer authentication layer for the portal.

## Issue Or Change Trigger

The trigger for correction was the need to preserve the separation between customer and owner access.

Once a customer logs in, the portal must not behave like a shared page or a loosely protected view. It must create a proper customer session, protect customer routes, and destroy that session on logout. That requires a more explicit plan than a simple form submission.

## Problem Discovered

The original assumption was too weak in several ways:

1. it did not explicitly define customer session creation and destruction
2. it did not fully define the difference between customer and owner sessions
3. it did not clearly state how expired or missing sessions should be handled
4. it did not make the logout behavior part of the security boundary

Without these rules, the customer portal would not be reliably protected.

## Root Cause

The root cause was treating login as a UI action instead of an access-control boundary.

For a customer portal, login is the point where the application decides whether the user may access customer-only routes. That means the login story must include session role assignment, route protection, and logout destruction.

## Decision Taken

The plan was updated so that customer login creates a customer session and customer routes enforce that session explicitly.

The final implementation model became:

- verify credentials against the stored password hash
- create a customer session on success
- redirect to the balance page
- protect customer routes with customer-only middleware
- destroy the session and clear the cookie on logout

## Business Rationale

The customer portal needs a secure direct login experience.

Customers should not have to rely solely on shared links. They should be able to authenticate directly and return to their portal later. That requires a real session model, not just a redirect from a form.

## Technical Rationale

The final application shows that authentication logic belongs in the customer model and route protection belongs in middleware.

That division keeps the login flow easy to test and keeps the security boundary consistent across customer routes. It also makes the customer and owner sessions easy to keep separate.

## Updated Implementation Plan

The revised implementation plan became:

1. render a customer login page
2. verify the submitted login identifier and password
3. create a customer-specific session on success
4. redirect to the customer balance page
5. protect customer-only routes with middleware
6. destroy the session on logout
7. add tests for login, logout, and route protection

## Impact On Architecture

The architecture was strengthened by making the customer portal explicitly session-based.

The customer model now owns authentication against stored customer credentials, and the middleware layer owns route access control. That keeps the app’s separation of concerns clean and makes future customer portal behavior easier to protect.

## Impact On Future Stories

This correction helps every later customer portal story.

Future balance, history, and notification features can assume there is a real customer session boundary. That reduces the risk of duplicating auth logic or exposing customer data through token-only or owner-only paths.

## Impact On UI

The login UI remained simple, but the flow behind it became more explicit.

The customer login page is now the entry point to a protected portal session rather than just a one-time form. The logout action also became a visible part of the UI contract because it ends the session, not merely the page state.

## Impact On Data / Logic

The correction clarified that customer authentication should use the existing customer identity record and password hash.

The session state itself remains separate from the SQLite schema, which is appropriate. The important logic is the credential verification and the assignment of the customer role in the session.

## Impact On Testing

The test plan expanded to cover the actual security boundary:

- login success
- login failure
- logout
- customer route protection
- admin-session rejection
- session-expired redirects

## Lessons From The Adjustment

1. Login is a session boundary, not just a form.
2. Customer and owner portals must remain explicitly separated.
3. Logout must fully clear access, not just hide the page.
4. Route protection should be tested as part of the login story.
5. A good authentication story gives the rest of the portal a reliable identity model.

## Final Outcome

The delivered implementation reflects the corrected plan:

- customer login creates a customer session
- customer routes require that session
- logout destroys the session
- customer and owner sessions stay separate

That is the correct final interpretation of Story 1.2 in the completed customer portal.
