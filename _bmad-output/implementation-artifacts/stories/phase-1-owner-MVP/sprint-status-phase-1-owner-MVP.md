# Sprint Status: Phase 1 Owner MVP

Date: 2026-06-04
Project: barista-coffee-membership
Status: Complete / Delivered

## 1. Current Status

Phase 1 Owner MVP is complete. The original Sprint 1 scaffold plan has been superseded by the delivered owner-operated MVP implementation.

This status file now tracks the completed Phase 1 delivery rather than the earlier Story 1.1-only implementation sequence.

## 2. Delivered Goal

The coffee shop owner can operate the prepaid cup membership program end-to-end from the admin portal:

- Log in and log out as admin.
- Create, search, and view customers.
- Record package purchases.
- Automatically calculate package amount at `30.000 ₫` per purchased cup.
- Apply bonus cup rules: `10 -> 11`, `20 -> 22`, `30 -> 33`.
- Track current balances.
- Record multi-cup deliveries.
- Prevent delivery at zero balance or above current balance.
- Void/cancel mistaken deliveries and restore customer balance.
- View package purchase history.
- View delivery history.
- View owner dashboard metrics.

## 3. Delivered Epics

| Epic | Status | Delivered Result |
|---|---|---|
| Epic 1: App Foundation | Delivered | Express app, config, SQLite schema/setup, database helper, package credit logic, test harness. |
| Epic 2: Owner Authentication | Delivered | Admin login/logout, bcrypt password hashing, sessions, protected `/admin/*` routes. |
| Epic 3: Customer Management | Delivered | Customer creation, duplicate prevention, list/search, and detail pages. |
| Epic 4: Package Purchases And Balance Credits | Delivered | Fixed VND pricing, automatic amount calculation, bonus rules, transactional balance updates, purchase history. |
| Epic 5: Delivery Recording And History | Delivered | Multi-cup deliveries, over-balance protection, void/cancel delivery, balance restoration, delivery history. |
| Epic 6: Basic Owner Dashboard | Delivered | Dashboard metrics for customers, outstanding cups, revenue, delivered cups, bonus cups, low-balance customers, recent deliveries. |

## 4. Implementation Evidence

Delivered code areas:

- `server.js`
- `config.js`
- `database/schema.sql`
- `database/setup.js`
- `database/database.js`
- `database/migrations.js`
- `middleware/auth.js`
- `middleware/csrf.js`
- `models/admin-user.js`
- `models/password.js`
- `models/customer-account.js`
- `models/cup-balance.js`
- `models/package-purchase.js`
- `models/delivery-history.js`
- `models/dashboard.js`
- `models/currency.js`
- `routes/admin.js`
- `views/shared/admin-login.html`
- `views/admin/dashboard.html`
- `public/css/styles.css`
- `public/js/admin.js`

## 5. Testing Evidence

Current test command:

```sh
npm test
```

Latest QA evidence:

- `28` tests passing.
- `0` failing.
- QA artifact: `_bmad-output/implementation-artifacts/qa-summary-current-feature-set.md`.

Phase 1 coverage includes:

- Admin login/logout.
- Admin route protection.
- Customer creation, duplicates, search, and detail behavior.
- Fixed VND pricing.
- Bonus rules: `10 -> 11`, `20 -> 22`, `30 -> 33`.
- Package purchase balance updates.
- Multi-cup delivery.
- Blocking delivery greater than balance.
- Void delivery with balance restoration.
- Voided deliveries excluded from dashboard delivered-cup totals.
- Dashboard metrics.
- Admin delivery pagination newest first.

## 6. Remaining Phase 1 Backlog

None.

Customer portal, shared balance links, QR access, and customer-facing UI enhancements are tracked outside Phase 1.

## 7. Completion Decision

Phase 1 Owner MVP is delivered and ready to remain closed. No artifact should treat Story 1.1 as the only completed Phase 1 work.
