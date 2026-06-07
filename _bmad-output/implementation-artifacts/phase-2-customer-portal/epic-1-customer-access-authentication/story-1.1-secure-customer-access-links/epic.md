# Story 1.1: Secure Customer Access Links

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `epic.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 1.1 was to give customers a secure, low-friction way to view their prepaid membership balance without exposing the admin portal or payment details. The product already had an owner-facing ledger, but the customer side needed a safe way for the shop to share balance visibility with the customer.

The completed application shows that the correct business model is a token-based access link that behaves like a read-only membership pass. The link must be easy to share, difficult to guess, and safe to revoke or regenerate. That is what makes the customer portal useful without introducing security risk.

## Epic Objective

Epic 1: Customer Access & Authentication exists to let customers view their membership information securely. The epic objective is to provide customer-specific access that is isolated from the admin portal, backed by secure link generation and authentication rules, and suitable for later customer portal features such as balance views, history, and notifications.

Story 1.1 is the foundation of that capability. It establishes the secure access link behavior that later stories depend on for customer login and portal access.

## Story Objective

The objective of Story 1.1 was to implement secure customer access links that allow the shop to share a customer’s balance page without exposing admin controls or other customers’ data.

Using the completed application as the source of truth, this includes:

- generating a unique customer balance access token
- allowing the token to resolve to a read-only customer balance page
- preventing access to unrelated customer data
- making token regeneration invalidate prior links
- keeping payment and admin data hidden from the customer-facing link

## User Value

The primary user value is convenience and trust.

Customers can be shown their balance quickly through a secure link or QR-based access flow without needing an admin login or a separate support process. The shop can share the balance page confidently because the link is customer-specific and read-only.

The owner also benefits because customer access no longer depends on manual explanation or insecure sharing of internal screens. The link is simple enough to use in daily operations but controlled enough to protect sensitive information.

At the product level, this story makes the customer portal feasible. Without a secure access link, later customer-facing portal stories would have no safe entry point.

## Acceptance Criteria

1. The application can generate a unique customer balance access link.
2. The access link opens a customer-specific balance page.
3. The page is read-only and does not expose admin controls.
4. The page does not expose payment amounts or internal purchase pricing.
5. The access link is tied to the correct customer only.
6. Regenerating the access token invalidates the previous link.
7. The customer cannot use one customer’s link to access another customer’s data.
8. The access link works consistently across browser sessions.
9. The behavior is covered by automated tests.
10. The secure link is usable as the foundation for customer portal access.

## Dependencies

Story 1.1 depends on the existing customer account model and the owner/admin side that creates and manages those customers.

Prerequisite dependencies:

- Phase 1 owner MVP foundation stories that provide customer records and auth controls
- customer account storage with a stable identifier
- balance data already tracked in the ledger
- existing server-rendered application framework

Technical dependencies:

- customer access token storage
- customer balance page rendering
- token generation and rotation logic
- route isolation between admin and customer areas

Downstream dependencies:

- customer login/logout story
- customer portal balance page
- customer notifications and history stories
- QR/share balance link behavior

## Risks

### Risk 1: Access links are guessable

If the link token is weak or predictable, one customer could potentially reach another customer’s data.

Mitigation:
Use a secure, unique token and bind it to a specific customer record.

### Risk 2: Old links remain valid after regeneration

If the token can be regenerated but previous links still work, the revocation model is broken.

Mitigation:
Make token regeneration invalidate the previous token immediately.

### Risk 3: Customer-facing pages expose internal or financial details

If the access page leaks payment amounts or admin actions, the feature becomes a security and privacy problem.

Mitigation:
Render a read-only view that hides payment and admin controls.

### Risk 4: Token links are hard to support operationally

If the link behavior is unclear, the owner will not trust it or will avoid using it in the shop.

Mitigation:
Keep the link specific, predictable in usage, and tied directly to the customer balance page.

### Risk 5: One customer can access another customer’s balance

If customer identity is not enforced on the route, the portal would leak sensitive account data.

Mitigation:
Bind the route to the token and resolve only the matching customer record.

## Priority

Priority: High

This story is high priority because it creates the secure entry point for the customer portal. Without it, customer-facing access is either missing or unsafe. It is the first step in making the membership experience available to the customer in a controlled way.

## Success Metrics

The story is successful when the shop can share a customer-specific access link and the customer can safely view only their own balance information.

Business-capability success metrics:

- secure customer links can be generated and reused until rotated
- the customer-facing page is read-only
- unauthorized cross-customer access is prevented

Quality metrics:

- regenerated tokens invalidate prior links
- the customer page does not show payment amounts or admin controls
- automated tests prove link security and customer isolation

Delivered evidence in the current application includes:

- customer access token routes and views
- customer balance page rendering
- token regeneration logic
- secure link tests in the customer portal suite

## Success Criteria Traceability To Delivered Application

The completed application confirms that Story 1.1 should be understood as the secure link foundation for the customer portal.

Implemented evidence includes:

- customer-specific access token generation and regeneration
- read-only balance page rendering
- hiding of payment amounts and admin actions
- customer isolation through route binding
- automated tests proving token replacement and access protection

The current application therefore confirms that this story is the secure access foundation for the Phase 2 customer portal.
