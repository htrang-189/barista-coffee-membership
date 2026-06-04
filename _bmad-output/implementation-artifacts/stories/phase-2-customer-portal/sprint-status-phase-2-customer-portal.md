# Sprint Status: Phase 2 Customer Portal

Date: 2026-06-04
Project: barista-coffee-membership
Status: Complete / Delivered

## 1. Current Status

Phase 2 Customer Portal is complete. The implemented application now includes authenticated customer self-service, read-only balance/history views, shared token-based balance access, QR code access, and the current customer membership UI.

This status file tracks the completed Phase 2 delivery. It should not be treated as an in-progress sprint plan.

## 2. Delivered Goal

Customers can access their own membership information without owner assistance while preserving owner-only control over package purchases, deliveries, and balance changes:

- Log in and log out as a customer.
- Access protected customer routes under `/customer/*`.
- View only their own account data.
- View a read-only customer portal.
- See current balance and remaining cups.
- See used cups.
- See package history without payment amounts.
- See delivery/cup history without admin actions.
- Use recent history previews with `View All` full-history pages.
- See low-balance messaging when balance is `<= 5`.
- Use a notification bell for low or exhausted balance states.
- See the membership hero card UI with dynamic greeting based on time of day.
- Open a shared customer balance page from a secure token link.
- Open the shared page through an owner-generated QR code.
- Continue seeing read-only balance/history content from shared links.

The owner can also manage customer access links:

- Copy a customer balance link.
- Show a QR code for the link.
- Regenerate the token.
- Invalidate the previous token by regenerating the link.

## 3. Delivered Epics

| Epic | Status | Delivered Result |
|---|---|---|
| Epic 1: Customer Authentication | Delivered | Customer login/logout uses existing customer accounts and password hashes. |
| Epic 2: Customer Route Protection | Delivered | Customer routes require customer sessions; customer sessions cannot access admin routes; customer data loads from session identity. |
| Epic 3: Customer Balance Overview | Delivered | `/customer/balance` shows a read-only balance page with remaining cups, used cups, status, and low-balance messaging. |
| Epic 4: Customer Histories | Delivered | Customer package and cup histories show recent previews with `View All` full-history pages, newest first. |
| Epic 5: Shared Balance Link And QR Access | Delivered | Secure token links and QR codes render read-only shared balance pages; regenerated tokens invalidate old links. |
| Epic 6: Customer Portal UX Polish | Delivered | Customer and shared pages use the premium coffee membership UI with hero card, dynamic greeting, progress bar, and notification bell. |
| Epic 7: Customer Portal Tests | Delivered | Customer auth, authorization, read-only behavior, share-link behavior, history limits, and notification rendering are covered by tests. |

## 4. Implementation Evidence

Delivered code areas:

- `routes/customer.js`
- `routes/admin.js`
- `middleware/auth.js`
- `middleware/csrf.js`
- `models/customer-account.js`
- `models/package-purchase.js`
- `models/delivery-history.js`
- `database/schema.sql`
- `database/migrations.js`
- `views/shared/customer-login.html`
- `views/customer/balance.html`
- `public/css/styles.css`
- `public/js/admin.js`

Delivered route surface:

- `GET /customer/login`
- `POST /customer/login`
- `POST /customer/logout`
- `GET /customer/balance`
- `GET /customer/package-history`
- `GET /customer/delivery-history`
- `GET /customer/access/:token`
- `GET /customer/access/:token/package-history`
- `GET /customer/access/:token/delivery-history`
- `POST /admin/customers/:customerId/balance-link/regenerate`

Delivered UI behavior:

- Customer header with Barista Membership label and notification bell.
- Membership hero card with dynamic greeting hooks.
- Right-side balance/status panel.
- Remaining cups and used cups display.
- Cup consumption progress bar.
- Low-balance and exhausted-package messages.
- Package history and cup history cards.
- Recent 5 history records by default with `View All` links.
- Shared balance-link page uses the same read-only customer UI.
- Customer-facing pages hide payment amounts.
- Customer-facing pages hide admin actions.

## 5. Testing Evidence

Current test command:

```sh
npm test
```

Latest QA evidence:

- `28` tests passing.
- `0` failing.
- QA artifact: `_bmad-output/implementation-artifacts/qa-summary-current-feature-set.md`.
- Phase 2 review artifact: `_bmad-output/implementation-artifacts/stories/phase-2-customer-portal/phase-2-customer-portal-review.md`.

Phase 2 coverage includes:

- Customer login success.
- Customer login failure.
- Customer logout.
- Unauthenticated customer route access redirects to customer login.
- Admin session cannot access customer balance route.
- Customer session cannot access admin dashboard.
- Customer balance page is read-only.
- Customer cannot call customer-side package or delivery mutation endpoints.
- Customer sees only their own balance/history data.
- Customer portal hides payment amounts.
- Customer portal hides admin actions.
- Shared token balance page renders read-only customer data.
- Invalid shared token returns 404.
- Owner can view copy-link and QR controls.
- Owner can regenerate a balance access token.
- Regenerated token invalidates the previous link.
- Shared token full-history pages hide payment amounts and admin actions.
- History previews show 5 records with full-history pages available.
- Notification bell and popover HTML render correctly.
- Low-balance notification content renders when balance is `<= 5`.
- Exhausted-package notification content renders when balance is `0`.
- No raw template placeholders appear in rendered customer pages.

## 6. Remaining Phase 2 Backlog

None.

Phase 2 Customer Portal is delivered. Future work such as browser-level visual regression, push notifications, payment integration, ordering, advanced reporting, or production hardening should be tracked as later enhancements, not remaining Phase 2 work.

## 7. Completion Decision

Phase 2 Customer Portal is complete and ready to remain closed.

The implemented app supports authenticated customer self-service, shared QR/balance-link access, read-only customer history views, low-balance notifications, and the current membership-card customer UI while preserving owner-only control over all package, delivery, and balance-changing actions.
