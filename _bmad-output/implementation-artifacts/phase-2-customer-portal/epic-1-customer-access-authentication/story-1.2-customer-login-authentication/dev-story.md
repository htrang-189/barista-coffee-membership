# Story 1.2: Customer Login Authentication

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `CODE`

Status: Reconstructed retrospective implementation evidence

## Development Objective

Implement customer login and logout so customers can access the portal through their own authenticated session, separate from the owner/admin session.

## Implementation Summary

The delivered application implements Story 1.2 as a standard session-based customer authentication flow. A customer can log in with a login identifier and password, the application validates the credentials against the stored password hash, and a customer session is created on success. Customer routes then require that session, and logout destroys it.

This story is the session-based boundary for the customer portal. It does not replace the secure access link story; it complements it by giving customers a traditional authenticated path into the portal.

## Files Created

### `routes/customer.js`

This route file contains the customer login/logout flow and customer route protection behavior.

Why it exists:

The customer portal needs a dedicated route layer for login, logout, and customer-only access.

What problem it solves:

It separates customer authentication from the owner portal and keeps the customer session logic in one place.

How it works:

- renders the customer login page
- accepts customer credentials
- creates a customer session on successful authentication
- clears the session on logout
- redirects missing or expired sessions back to the customer login page

### `tests/customer-portal.test.js`

This file is the main evidence source for the customer login implementation.

Why it exists:

Customer login and route protection are security-sensitive and must be verified end to end.

What problem it solves:

It ensures the login flow works, invalid credentials fail generically, logout clears the session, and customer routes remain protected.

How it works:

- seeds isolated SQLite-backed test databases
- logs in as a customer using the login form
- checks redirects and session-protected routes
- verifies logout destroys access
- verifies admin sessions cannot be used for customer routes

## Files Modified

### `models/customer-account.js`

This model was extended to support customer authentication.

Why it exists:

Customer login must validate against the customer record and password hash stored in the database.

What problem it solves:

It provides a single source of truth for customer identity and credential verification.

How it works:

- looks up a customer by login identifier
- verifies the submitted password against the stored password hash
- returns a customer user object on success

Relevant exported function:

- `authenticateCustomer(...)`

### `middleware/auth.js`

This middleware file was extended to protect customer routes separately from admin routes.

Why it exists:

The customer portal needs its own session boundary and route protection.

What problem it solves:

It prevents access to customer pages without a valid customer session and keeps customer and owner sessions distinct.

How it works:

- `requireCustomer(...)` blocks access unless the session role is customer
- `redirectAuthenticatedCustomer(...)` prevents logged-in customers from seeing the login page again

### `views/shared/customer-login.html`

This shared template is rendered by the customer login route.

Why it exists:

The login form needs a server-rendered page that fits the application’s existing pattern.

What problem it solves:

It gives customers a simple entry point for session-based login.

How it works:

- renders the login form
- shows generic error messages
- preserves the login identifier on failure

### `tests/e2e-owner-customer-flow.test.js`

This end-to-end test file verifies customer authentication in the context of the full application.

Why it exists:

Customer login must work in the real portal flow, not just in isolated unit logic.

What problem it solves:

It confirms the customer session survives the login flow and that customer pages remain accessible only after authentication.

How it works:

- logs in through the customer login page
- checks the balance page redirect
- verifies customer-only route access after login
- verifies cross-portal protection

## Database Changes

### No schema changes

Story 1.2 does not add or modify production schema.

Why it exists:

The customer table already stores the data needed for login.

What problem it solves:

It keeps the story focused on session authentication rather than database redesign.

How it works:

- uses the existing customer login identifier
- uses the existing password hash field
- stores session state outside the SQLite schema

## Routes Added

### `GET /customer/login`

Why it exists:

Customers need a page to enter their login credentials.

What problem it solves:

It provides the customer-facing authentication entry point.

How it works:

- renders the login form
- supports a session-expired message

### `POST /customer/login`

Why it exists:

The application needs a route to validate submitted customer credentials.

What problem it solves:

It authenticates the customer and creates a customer session.

How it works:

- checks the submitted login identifier and password
- validates credentials via the customer model
- creates a session on success
- redirects to `/customer/balance`
- returns a generic invalid-login message on failure

### `POST /customer/logout`

Why it exists:

Customers need a way to end their session safely.

What problem it solves:

It ensures the customer portal cannot remain open after logout.

How it works:

- requires a customer session
- destroys the session
- clears the session cookie
- redirects to the customer login page

## Models Added

### `models/customer-account.js` authentication helpers

This story extends the customer account model with authentication logic.

Why it exists:

Customer login is part of customer identity and credential management.

What problem it solves:

It keeps the login logic close to the stored customer data and password hash.

How it works:

- `authenticateCustomer(...)` verifies the submitted password
- returns a customer role object when valid
- returns null on failure

## UI Components Added

### Customer login form

Why it exists:

Customers need a simple visual entry point for the authenticated portal.

What problem it solves:

It lets the customer sign in without using owner/admin controls or a shared access link.

How it works:

- accepts login identifier and password
- shows generic errors
- supports redirect messaging for expired sessions

### Logout action in the customer portal

Why it exists:

Customers need a clear way to end their authenticated session.

What problem it solves:

It prevents the portal from staying accessible after use.

How it works:

- submits a POST logout action
- destroys the session
- returns the customer to the login page

## Business Logic Implemented

The story implements the following business rules:

- only valid customer credentials create a session
- the customer session is separate from the owner session
- customer-only routes require a valid customer session
- expired or missing sessions redirect to the customer login page
- logout destroys access

Why this logic exists:

The customer portal must be secure and identity-aware.

What problem it solves:

It prevents unauthorized access and keeps customer and owner experiences isolated.

How it works:

- validates credentials against password hashes
- stores session state with the customer role
- checks the customer role in route protection middleware
- destroys the session on logout

## Validation Rules

The implementation validates:

- login identifier must match a stored customer
- password must match the stored hash
- invalid credentials must not create a session
- customer-only routes require the correct session role

These validation rules are critical because they form the security boundary of the customer portal.

## Security Controls

The customer login flow is secured by both credential verification and route protection.

Why this exists:

The customer portal contains private membership data.

What problem it solves:

It prevents cross-portal access and unauthorized browsing.

How it works:

- verifies passwords against stored hashes
- creates a customer-specific session
- protects customer routes with middleware
- destroys the session on logout

## Test Coverage

The delivered tests cover:

- valid customer login
- invalid customer login
- logout clearing the session
- customer route protection
- admin-to-customer route rejection
- customer-to-admin route rejection

## How This Supports The User Workflow

This story supports the customer workflow by allowing the customer to sign into their own portal session, revisit the balance page, and leave the session securely when finished.

## Delivered Output

The delivered output for Story 1.2 is a working customer authentication flow that includes:

- login page
- password verification
- customer session creation
- customer route protection
- logout and session clearing

## Evidence From Current Web App

Relevant delivered files include:

- `routes/customer.js`
- `models/customer-account.js`
- `middleware/auth.js`
- `views/shared/customer-login.html`
- `tests/customer-portal.test.js`
- `tests/e2e-owner-customer-flow.test.js`

The current application confirms that Story 1.2 delivered the customer authentication boundary required for the Phase 2 customer portal.
