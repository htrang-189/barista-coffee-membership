# Story 1.1: Secure Customer Access Links

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `Approve`

Status: Reconstructed retrospective code review

## Review Purpose

This review evaluates whether the secure customer access link implementation is aligned with the application architecture, safe from a security perspective, and sufficiently covered by tests.

Because this story exposes customer data outside the admin portal, the review focus is on token security, route isolation, and read-only rendering.

## Reviewed Scope

The review covered:

- `models/customer-account.js`
- `routes/customer.js`
- `routes/admin.js`
- `tests/customer-portal.test.js`
- `tests/e2e-owner-customer-flow.test.js`

## Architecture Compliance

The implementation is aligned with the application architecture.

Customer access token behavior lives in the customer account model, which is the right place for token generation and rotation. The customer-facing routes are separate from the admin routes, which preserves the app’s route-level separation between owner and customer concerns.

The customer portal remains server-rendered, matching the rest of the application. There is no unnecessary client-side state management added just to support secure links.

## Coding Standards

The code follows the repository’s established style:

- domain logic in model helpers
- route handlers that stay focused on request/response flow
- explicit helper functions for token generation and unique lookup
- test files that use isolated SQLite databases and Supertest

The implementation is readable and consistent with the rest of the codebase. The token logic is not over-abstracted, which is appropriate for the size of the feature.

## Security Review

Security is the main strength of this story.

The access link is customer-specific and token-based. The customer route resolves only the matching customer record, and the token regeneration path invalidates the previous link. That is the right control model for a shareable membership page.

The customer-facing page is read-only and hides payment and admin content. That prevents exposure of internal pricing details or owner controls through the public customer link.

The regeneration control is gated behind the admin route and CSRF protection, which is necessary because it changes access state.

## Validation Review

The implementation validates the important access-link behaviors:

- the token must map to a real customer
- the customer-facing route only renders the matching customer
- regenerated tokens replace the prior one
- customer-facing output remains read-only

These validations are appropriate because the business risk here is not invalid form content; it is data exposure and stale-link reuse.

## Database Integrity Review

The database usage is appropriate for the story.

The access token is stored on the customer record, which makes the token lifecycle easy to reason about and keeps the customer account the source of truth. Token rotation updates the stored token rather than layering a second access table on top of the customer model.

This design supports revocation cleanly and avoids unnecessary duplication.

## Error Handling Review

The implementation behaves sensibly when token lookup fails or when regeneration is requested for a missing customer.

The tests verify invalid or stale access behavior, which is the more important concern for this feature than a generic input error path.

The route behavior keeps failures from becoming security leaks. It does not fall back to a broad search or reveal another customer’s data on bad token input.

## UI Consistency Review

The customer-facing balance page is consistent with the portal direction of the product.

It is minimal, read-only, and focused on the customer’s own membership information. The page does not expose admin controls or financial details, which is exactly what a secure shareable customer link should do.

The admin-side share controls also fit the existing back-office style. They provide link regeneration and QR/share affordances without introducing a new interaction pattern.

## Test Coverage Review

The test coverage is strong for the risk profile of this feature.

The suite verifies:

- token-based customer page access
- customer isolation
- old-link invalidation after regeneration
- read-only rendering without payment or admin content
- owner-side token regeneration flow

The e2e coverage is particularly useful because it proves the route and session behavior work in the real application, not just in isolated unit logic.

## Findings

1. Token generation and rotation are implemented in the correct domain layer.
2. The customer-facing route is isolated and read-only.
3. Regenerated tokens invalidate prior links as intended.
4. The admin regeneration action is protected and operationally convenient.
5. Tests cover the main security and access-control concerns.

## Issues

No blocking issues were identified.

The only residual risk is the normal one for any token-based access feature: future changes must continue to treat the token as a security boundary and not as a cosmetic URL component. That is a maintenance rule, not a current defect.

## Recommendations

1. Preserve the current token rotation model in later customer portal work.
2. Keep customer access routes read-only as more portal features are added.
3. Extend tests whenever new customer-facing data is added behind tokenized routes.

## Approval Decision: Approved

The delivered implementation is architecturally consistent, security-conscious, and sufficiently covered by tests for a secure customer access link feature.

## APPROVED
