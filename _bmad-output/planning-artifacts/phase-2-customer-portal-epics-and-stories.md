# Phase 2 Customer Portal: Epics And Stories

Date: 2026-06-03
Project: barista-coffee-membership
Status: Reconciled with Current Implementation And QA Gate

## 1. Purpose

Document the implemented Phase 2 customer portal and related QR/share balance link enhancement. The customer portal remains read-only and preserves owner-only control over customers, packages, deliveries, and delivery voiding.

Source artifacts:

- Project Context: `_bmad-output/project-context.md`
- PRD: `_bmad-output/planning-artifacts/prd.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Phase 2 Scope: `_bmad-output/planning-artifacts/phase-2-customer-portal-scope.md`
- Current implementation and QA gate

## 2. Scope Decisions

- Customer package history omits payment amounts.
- Customer delivery history shows notes when notes exist.
- Voided deliveries are clearly labelled.
- Customer display uses the customer's full name.
- Customer login identifier is not shown after login.
- History previews show recent records, currently 3-5 records, with `View All` pages.
- Shared QR/balance links are secure token-based bearer links.
- Shared links are read-only and hide payment amounts and admin actions.
- Regenerating a token invalidates the old shared link.
- Customer and shared balance pages use the current premium coffee membership UI: dark green/cream palette, time-of-day greeting, member-since message, cup progress bar, and low/exhausted balance notification bell.

## 3. Implementation Order

| Order | Epic | Customer-Visible Value |
|---|---|---|
| 1 | Epic 1: Customer Authentication | Customer can log in and reach the portal area. |
| 2 | Epic 2: Customer Route Protection | Customer can only access their own read-only account area. |
| 3 | Epic 3: Customer Balance Overview | Customer sees current balance and low-balance status. |
| 4 | Epic 4: Customer Histories | Customer sees compact package and delivery history with full-history pages. |
| 5 | Epic 5: Shared Balance Link And QR Access | Customer can use owner-shared read-only balance links. |
| 6 | Epic 6: Customer Portal UX Polish | Customer portal is mobile-friendly and visually consistent. |
| 7 | Epic 7: Customer Portal Tests | Customer portal and share-link behavior are covered by focused tests. |

## 4. Epic 1: Customer Authentication

### Story 2.1: Add Customer Authentication Model

Acceptance criteria:

- Model finds a customer by login identifier.
- Model verifies password against `password_hash`.
- Successful authentication returns safe session data: customer id, role `customer`, and name.
- Failed authentication returns no customer.
- Raw password is never returned or logged.

### Story 2.2: Build Customer Login Page

Acceptance criteria:

- `GET /customer/login` renders customer login page.
- Page includes login identifier and password fields.
- Page does not include admin navigation.
- Page follows mobile-first UI guidelines.

### Story 2.3: Implement Customer Login And Logout

Acceptance criteria:

- `POST /customer/login` validates customer credentials.
- Valid credentials create a customer session and redirect to `/customer/balance`.
- Invalid credentials show a generic error message.
- `POST /customer/logout` clears the customer session and redirects to `/customer/login`.

## 5. Epic 2: Customer Route Protection

### Story 2.4: Add Customer Auth Middleware

Acceptance criteria:

- `requireCustomer` protects authenticated customer routes.
- Unauthenticated customer route access redirects to `/customer/login`.
- Customer session requires role `customer`.
- Customer middleware does not allow admin sessions to substitute for customer sessions.

### Story 2.5: Enforce Customer/Admin Separation

Acceptance criteria:

- Customer session cannot access `/admin/*`.
- Customer portal does not render admin navigation.
- Customer portal does not render owner-only actions.
- Customer data is loaded from session identity, not request parameters.

## 6. Epic 3: Customer Balance Overview

### Story 2.6: Build Read-Only Customer Balance Page

Acceptance criteria:

- `GET /customer/balance` renders the logged-in customer's page.
- Page shows customer full name.
- Page shows current cup balance prominently.
- Page shows used cups and cup consumption progress.
- Page shows low-balance warning when current balance is `<= 5`.
- Page shows a notification bell with low/exhausted balance popover when applicable.
- Page is read-only.
- Page does not show admin actions.
- Page does not show login identifier.

### Story 2.7: Add Customer Portal Navigation Shell

Acceptance criteria:

- Customer portal has a simple header or shell.
- Customer portal includes logout action for authenticated sessions.
- Customer portal does not include admin dashboard, customers, deliveries, or reports navigation.
- Navigation works on mobile.

## 7. Epic 4: Customer Histories

### Story 2.8: Show Customer Package History

Acceptance criteria:

- Customer balance page shows recent package purchases.
- `View All` opens `/customer/package-history`.
- Full package history is newest first.
- History shows package size, bonus cups, total cups added, and date/time.
- History hides payment amounts.
- History does not include admin controls.

### Story 2.9: Show Customer Delivery History

Acceptance criteria:

- Customer balance page shows recent deliveries.
- `View All` opens `/customer/delivery-history`.
- Full delivery history is newest first.
- History shows delivered cup quantity, delivery date/time, balance after delivery, and note when present.
- Voided deliveries are clearly labelled.
- Customer cannot record, edit, or void deliveries.

## 8. Epic 5: Shared Balance Link And QR Access

### Story 2.10: Add Secure Balance Access Token

Acceptance criteria:

- Each customer has one secure `balance_access_token`.
- Token is generated when a customer is created.
- Existing customers are backfilled through migration/setup.
- Token does not expose customer id, phone, or login identifier.

### Story 2.11: Add Shared Read-Only Balance Route

Acceptance criteria:

- `GET /customer/access/:token` renders the linked customer's read-only balance page.
- Invalid token returns 404.
- Shared page shows current balance and compact history previews.
- Shared page uses the same customer membership UI as the authenticated customer balance page.
- Shared page hides payment amounts, login identifier, admin navigation, and admin actions.
- Shared page does not require customer login.

### Story 2.12: Add Shared Full-History Routes

Acceptance criteria:

- `GET /customer/access/:token/package-history` renders read-only full package history.
- `GET /customer/access/:token/delivery-history` renders read-only full delivery history.
- Invalid token returns 404.
- Full-history pages are newest first.
- Full-history pages hide payment amounts and admin actions.

### Story 2.13: Add Owner Share-Link Controls

Acceptance criteria:

- Owner customer detail page shows a compact shareable balance link.
- Owner can copy the balance link.
- Owner can show a QR code encoding the secure balance link.
- Owner can regenerate the link.
- Regenerating the link invalidates the previous token.

## 9. Epic 6: Customer Portal UX Polish

Acceptance criteria:

- Customer and shared pages use the warm, premium coffee-shop design language.
- Current balance remains prominent.
- Hero includes time-of-day greeting and member-since message.
- Customer pages include cup progress and notification bell behavior.
- History previews stay compact and readable.
- Long shared URLs are visually truncated in owner UI but copy the full URL.
- Layout is a responsive desktop web layout that stacks on smaller screens.

## 10. Epic 7: Customer Portal Tests

Acceptance criteria:

- Customer login success and failure are tested.
- Customer logout is tested.
- Unauthenticated customer route access is tested.
- Customer cannot access admin routes.
- Customer can only view their own authenticated balance/history.
- Customer portal does not expose payment amounts or admin actions.
- Shared token access is tested.
- Invalid and regenerated token behavior is tested.
- History preview limits and full-history routes are tested.
