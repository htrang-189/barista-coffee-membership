# Story 1.1: Secure Customer Access Links

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `CODE`

Status: Reconstructed retrospective implementation evidence

## Development Objective

Implement secure customer-specific access links that open a read-only membership balance page, protect customer privacy, and allow the shop to revoke or regenerate shared access safely.

## Implementation Summary

The delivered application implements Story 1.1 as a customer-token access layer on top of the existing customer account model. The owner can generate or share a customer-specific access link that resolves to a read-only customer balance page. The customer portal routes are isolated from the admin portal, and old links can be invalidated when a token is regenerated.

This story is the security foundation for the customer portal. It does not add a new customer experience by itself so much as it makes the customer-facing balance page safe to expose.

## Files Created

### `routes/customer.js`

This route file contains the customer access-token behavior and the read-only customer balance rendering.

Why it exists:

The customer portal needs a dedicated route layer separate from the admin portal so the secure access link can be handled cleanly.

What problem it solves:

It provides a customer-specific path that resolves the token to the correct balance page and prevents the customer view from inheriting admin-only behavior.

How it works:

- resolves the access token route
- finds the matching customer by balance access token
- renders a read-only customer balance page
- renders package and delivery history for the tokenized view
- hides admin actions and payment amounts
- provides the fallback notification binding script for later customer portal behavior

### `tests/customer-portal.test.js`

This file is a key source of evidence for the customer access link behavior.

Why it exists:

The access link is security-sensitive and must be verified end to end.

What problem it solves:

It ensures the customer portal only shows the right customer’s data, hides admin content, and invalidates old links when tokens change.

How it works:

- creates isolated SQLite-backed app contexts
- generates customers and seeds balances
- opens tokenized customer routes
- verifies read-only output and hidden admin/payment content
- checks token regeneration and cross-customer isolation

## Files Modified

### `models/customer-account.js`

This model was extended to support customer balance access tokens.

Why it exists:

The secure access token belongs to the customer account domain, not just the routing layer.

What problem it solves:

It makes token creation, lookup, and regeneration part of the customer record lifecycle.

How it works:

- generates unique base64url tokens
- stores the token in `customer_accounts`
- looks up customers by token
- rotates the token when regeneration is requested
- backfills missing tokens if needed

Relevant exported functions include:

- `generateBalanceAccessToken(...)`
- `createUniqueBalanceAccessToken(...)`
- `findCustomerByBalanceAccessToken(...)`
- `rotateCustomerBalanceAccessToken(...)`

### `routes/admin.js`

The admin route file was modified to generate and regenerate the customer access link from the owner portal.

Why it exists:

The owner needs to share customer access safely from the admin workflow.

What problem it solves:

It gives the shop a controlled way to expose customer access and revoke old links.

How it works:

- builds the shareable customer balance URL
- renders the QR/link controls on the customer detail page
- exposes a route to regenerate the customer balance token
- shows success feedback when the link is regenerated

### `tests/e2e-owner-customer-flow.test.js`

This end-to-end test file was extended to verify secure customer link behavior in a real owner flow.

Why it exists:

The access link must work in the real portal, not only in isolated model code.

What problem it solves:

It verifies the secure link remains valid until regenerated and that the customer portal continues to behave correctly after access changes.

How it works:

- logs in as the owner
- inspects the customer detail page
- regenerates the access token
- verifies the old token fails and the new one succeeds
- checks customer-facing rendering after token changes

## Database Changes

### `customer_accounts.balance_access_token`

The customer account record stores the secure access token used by the customer portal.

Why it exists:

The access link needs a durable customer-specific binding so a token can be resolved back to the correct account.

What problem it solves:

It prevents cross-customer access and makes token rotation possible.

How it works:

- stores one unique token per customer
- replaces the old token when regenerated
- serves as the lookup key for the customer access route

### Token regeneration behavior

The database is used as the source of truth for token state.

Why it exists:

Access revocation must be durable and not just an in-memory setting.

What problem it solves:

It ensures that an old access link stops working when a new one is generated.

How it works:

- updates the token field on the customer record
- returns the customer with the new token state

## Routes Added

### `GET /customer/access/:token`

Why it exists:

The customer needs a shareable link that opens directly to their balance page.

What problem it solves:

It gives the customer portal a secure public-ish entry point without exposing the admin side.

How it works:

- resolves the token to a single customer
- renders the customer balance page as read-only
- hides payment amounts and admin controls

### `GET /customer/access/:token/package-history`

Why it exists:

The customer balance page can link to package history in the tokenized portal later in the flow.

What problem it solves:

It keeps the customer-specific access path consistent for history navigation.

How it works:

- resolves the token
- renders the package history for the same customer
- uses the tokenized path as the navigation base

### `GET /customer/access/:token/delivery-history`

Why it exists:

The tokenized portal needs delivery history navigation as well as balance display.

What problem it solves:

It gives the customer a secure path to view visits and history without admin access.

How it works:

- resolves the token
- renders the delivery history for the matching customer
- keeps the path read-only and customer-specific

### `POST /admin/customers/:customerId/balance-link/regenerate`

Why it exists:

The owner needs to revoke old shared links and issue a new one.

What problem it solves:

It makes the access link safe to rotate when needed.

How it works:

- requires admin authentication
- requires CSRF protection
- generates a new token for the customer
- invalidates the previous token

## Models Added

### `models/customer-account.js` token helpers

This story extends the customer account model rather than adding a new model.

Why it exists:

Customer access is part of customer account state.

What problem it solves:

It keeps token generation and token lookup close to the customer identity data.

How it works:

- `generateBalanceAccessToken(...)` creates a secure random token
- `createUniqueBalanceAccessToken(...)` avoids collisions
- `findCustomerByBalanceAccessToken(...)` resolves the access page
- `rotateCustomerBalanceAccessToken(...)` replaces the current link

## UI Components Added

### Customer balance access page

Why it exists:

The customer needs a readable balance view they can access via tokenized link.

What problem it solves:

It replaces the need for the customer to see admin screens or rely on manual balance explanation.

How it works:

- renders a read-only balance card
- hides payment and admin data
- links into tokenized package and delivery history paths

### Admin customer detail link controls

Why it exists:

The owner needs a visible way to copy or regenerate the access link.

What problem it solves:

It makes secure sharing operationally easy.

How it works:

- displays the tokenized URL
- provides link regeneration
- shows the customer QR and share controls

## Business Logic Implemented

The key business rules implemented by this story are:

- each customer has a unique access token
- the token resolves only to that customer’s data
- old tokens become invalid when regenerated
- the customer-facing page is read-only
- payment and admin data remain hidden

Why this logic exists:

The customer portal must be safe to share without exposing the admin portal or other customers’ information.

What problem it solves:

It prevents privacy leaks and makes link sharing manageable in the real shop.

How it works:

- generates secure token values with `crypto.randomBytes`
- stores token in the customer record
- resolves routes using the stored token
- regenerates the token when the owner requests a new link

## Validation Rules

The implementation validates:

- the token must match an existing customer record
- regenerated links replace the prior token
- the customer balance page returns read-only output
- customer access routes must not leak admin actions or payment amounts

These rules exist to keep the customer portal private and safe to share.

## Security Controls

The secure access link is protected by design and by route behavior.

Why this exists:

The customer portal exposes account data outside the admin portal.

What problem it solves:

It reduces the risk of cross-customer data leakage and stale-link reuse.

How it works:

- token-based customer lookup
- token rotation invalidates old links
- admin-only regeneration route
- read-only customer page rendering

## Test Coverage

The delivered tests cover the important security and rendering behaviors.

### Token and access coverage

- token resolves to the correct customer
- old token no longer works after regeneration
- customer pages reject access to unrelated customer data

### Read-only rendering coverage

- payment amounts are not visible
- admin controls are not visible
- customer access paths remain customer-specific

### Integration coverage

- owner can regenerate the balance link from the admin portal
- the regenerated link works and the old link fails

## How This Supports The User Workflow

This story supports the owner workflow by making customer balance access safe to share. The shop can generate a tokenized link from the owner portal, hand that link to the customer, and know the customer will only see their own read-only balance information.

That is the minimum secure foundation needed for the rest of the customer portal experience.

## Delivered Output

The delivered output for Story 1.1 is a secure, customer-specific access path that includes:

- token generation and regeneration
- token-based customer balance routing
- read-only customer-facing balance rendering
- hidden admin and payment details
- customer isolation

## Evidence From Current Web App

Relevant delivered files include:

- `models/customer-account.js`
- `routes/customer.js`
- `routes/admin.js`
- `tests/customer-portal.test.js`
- `tests/e2e-owner-customer-flow.test.js`

The current application confirms that this story delivered the secure customer access foundation required for the Phase 2 customer portal.
