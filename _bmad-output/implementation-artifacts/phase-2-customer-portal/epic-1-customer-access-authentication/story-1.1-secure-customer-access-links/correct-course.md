# Story 1.1: Secure Customer Access Links

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `Updated Plan`

Status: Reconstructed retrospective change-control artifact

## Correct-Course Purpose

This artifact documents the gap between the original access-link assumption and the final delivered solution. Story 1.1 began as a secure customer access concept, but the completed application shows that the correct implementation needed a customer-specific, revocable token model with a read-only page boundary.

## Original Assumption

The original assumption could have been that a customer balance link was just a shareable URL. That would have been too loose for a real membership product because a generic shareable link does not clearly define revocation, customer isolation, or privacy boundaries.

The delivered application shows that the link needed to be more than a URL. It needed to be a security-sensitive token tied to one customer record and designed to be invalidated on demand.

## Issue Or Change Trigger

The change trigger was the security and privacy nature of the customer portal. Once the application exposes customer balance data outside the admin portal, the link must be treated as a real access credential, not a convenience shortcut.

That requirement forced a more precise plan:

- token-based access instead of a generic URL
- customer binding instead of broad lookup
- revocation via token regeneration
- read-only customer rendering

## Problem Discovered

The original assumption was too vague in three ways:

1. it did not sufficiently define how a link is tied to exactly one customer
2. it did not clearly define how the link is revoked or replaced
3. it did not explicitly state that the customer page must hide internal payment and admin data

Without those rules, the link could become a privacy risk instead of a safe sharing mechanism.

## Root Cause

The root cause was treating customer access as a UX convenience instead of a security boundary.

For a prepaid membership system, the access link controls visibility into financial-like account information. That means the token lifecycle, route isolation, and read-only rendering rules must be defined up front.

## Decision Taken

The plan was updated to treat the customer access link as a secure, revocable token bound to one customer.

The final delivery model became:

- generate a unique token for each customer
- resolve the balance page from that token
- keep the page read-only
- hide payment and admin details
- invalidate old links when the token is regenerated

## Business Rationale

The business needs a practical way to share customer balances without creating support friction or privacy risk.

The owner must be able to hand the customer a link or QR code and trust that it only opens the correct balance page. The corrected plan supports that operational need while keeping the product safe.

## Technical Rationale

The final implementation shows that the right place for this feature is the customer account model and customer route layer.

The token belongs with the customer record because token generation, lookup, and rotation are part of the account lifecycle. The route layer then resolves the token and renders a read-only balance page.

That is the correct architecture for a secure, minimal customer portal foundation.

## Updated Implementation Plan

The revised implementation plan became:

1. add unique customer access token storage and generation
2. expose a customer access route that resolves the token to one customer
3. render the customer balance page as read-only
4. hide payment amounts and admin controls from the customer view
5. add token regeneration from the admin portal
6. make token regeneration invalidate the previous link
7. add tests for token isolation and revocation

## Impact On Architecture

The architecture became stronger and more explicit.

The customer account model now owns access-token lifecycle behavior, and the customer route owns the read-only customer-facing display. That keeps the access link from becoming a loose view-only shortcut and instead makes it a genuine access control feature.

## Impact On Future Stories

This adjustment sets a safe foundation for the rest of the customer portal.

Future stories for login, balance display, history, notifications, and QR access can now assume there is a secure entry point. That reduces the risk of duplicating access logic later or leaking admin content through customer views.

## Impact On UI

The UI became intentionally constrained:

- the customer page must look like a membership balance view, not an admin dashboard
- payment values and admin controls must not be shown
- the page must be easy to share and revisit

That keeps the customer-facing experience simple and safe.

## Impact On Data / Logic

The correction clarified that the token is a real data-bound access control value.

The implementation must:

- bind the token to one customer record
- invalidate older tokens on regeneration
- use the token as the route lookup key
- keep the balance page read-only

## Impact On Testing

The test plan became more focused on security and isolation.

The implementation needed tests for:

- correct customer resolution from the token
- rejection of stale or replaced tokens
- hiding of admin/payment content
- customer isolation across accounts

## Lessons From The Adjustment

1. A customer access link is a security feature, not just a convenience URL.
2. Token revocation must be explicit or the feature is not safe to share.
3. The customer portal must be read-only by default.
4. Customer isolation needs to be proven in tests, not assumed.
5. Secure shareable access is a foundational capability for the rest of the portal.

## Final Outcome

The delivered solution reflects the corrected plan:

- token-based customer access
- read-only balance page
- hidden admin/payment data
- token rotation and invalidation
- customer-specific route binding

That is the correct final interpretation of Story 1.1 in the completed customer portal.
