# Story 1.1: Secure Customer Access Links

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `story-[slug].md`

Status: Reconstructed retrospective implementation story

## Story Title

Secure Customer Access Links

## Business Context

The Barista Coffee Membership product already has an owner-facing ledger for packages, deliveries, and customer balance management. The customer portal needs a safe way to expose membership balance information without revealing the admin experience or internal payment details. Story 1.1 provides that entry point.

The completed application shows that the correct solution is a secure, customer-specific access link that resolves to a read-only balance page. This makes it practical for the shop to share membership information with customers while keeping the rest of the system private.

Without this story, customer portal access would either be missing or insecure. This story therefore acts as the security foundation for the Phase 2 customer experience.

## User Story

As the shop owner, I want to share a secure customer-specific balance link so that the customer can view their membership balance without seeing admin controls or other customers’ data.

## Acceptance Criteria

1. The application generates a unique access link for each customer.
2. The link resolves to the correct customer-specific balance page.
3. The customer-facing page is read-only.
4. The page hides payment amounts and admin actions.
5. The link is tied only to the intended customer.
6. Regenerating the token invalidates the previous link.
7. One customer cannot use another customer’s link to access account data.
8. The link continues to work across normal browser usage.
9. Automated tests cover token rotation and customer isolation.
10. The link is suitable as the foundation for later customer portal features.

## Functional Requirements

The application must generate a unique access token for each customer.

The application must resolve the token to the corresponding customer balance page.

The application must render the balance page as read-only.

The application must not expose payment amounts, admin controls, or other internal owner-only actions on the customer-facing page.

The application must invalidate the previous access link whenever a new token is generated for the customer.

The application must prevent one customer’s token from being used to access another customer’s data.

The application must make the secure access link available as the entry point for the customer portal.

The application must support the secure link in a way that is usable in real shop operations, including sharing it directly or through QR-based access later.

## Non-Functional Requirements

The access link must be secure enough to prevent casual guessing or cross-customer access.

The token lifecycle must be deterministic and easy to reason about.

The customer-facing page must remain simple and fast to load.

The implementation must fit the existing Express and server-rendered architecture without requiring a separate front-end application.

The solution must be testable for token regeneration, route isolation, and read-only rendering.

The implementation must preserve the privacy boundary between customer-facing views and owner/admin views.

## UI Requirements

The customer-facing balance page must present a clean, read-only membership view.

The page must not show payment amounts, price details, or admin actions.

The page must clearly present the customer’s own balance information and nothing more.

The access page must be easy to share and easy to revisit from a browser without special login steps.

The UI should remain visually consistent with the Barista membership brand while staying minimal and safe.

## Database Requirements

The customer data model must support a unique access token or equivalent token-rotation field.

The database must bind the token to one customer record.

The database must allow a token to be regenerated so that prior links become invalid.

The balance data must remain the source of truth for what the customer sees on the page.

The schema must not require separate customer portal tables just to support this story.

## Technical Notes

The delivered application shows that the secure link behavior is implemented through customer-specific token routes and customer balance rendering in the customer portal.

The route resolves only the customer tied to the current access token.

Regeneration invalidates the prior token, which is the correct revocation model for shared access.

The customer-facing view is rendered without admin actions or payment information, preserving the read-only boundary.

The implementation is intentionally model-driven and server-rendered, which keeps the feature simple and aligned with the rest of the application.

## Testing Requirements

Tests must verify that the secure access link resolves to the correct customer.

Tests must verify that token regeneration invalidates the previous link.

Tests must verify that the customer-facing page remains read-only.

Tests must verify that payment amounts and admin actions are hidden.

Tests must verify that one customer cannot access another customer’s data.

Tests should confirm that the secure link can be used as the basis for later customer portal stories.

## Definition Of Done

The story is done when the shop can generate and share a secure customer access link, the customer can open a read-only balance page, and the application prevents cross-customer access or stale-link reuse.

The story is not done if the page exposes internal payment details, if old tokens remain valid after regeneration, or if a customer can reach another customer’s account data.

## Expected Delivered Output

The expected delivered output is a secure customer access link flow that includes:

- customer-specific token generation
- read-only balance page access
- token rotation and invalidation
- customer isolation
- hidden admin/payment information

The completed application confirms that this story delivered the secure link foundation needed for the Phase 2 customer portal.
