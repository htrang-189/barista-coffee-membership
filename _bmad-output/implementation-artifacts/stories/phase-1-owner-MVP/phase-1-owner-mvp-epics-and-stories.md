# Phase 1 Owner MVP: Retrospective Delivery Record

Date: 2026-06-04
Project: barista-coffee-membership
Status: Delivered / Implemented

## 1. Purpose

Phase 1 was originally planned as multiple implementation stories, beginning with Story 1.1 scaffold work. The application was then implemented iteratively beyond the initial scaffold. This artifact replaces the incomplete story-by-story planning view with a retrospective delivery record for the completed Owner MVP.

Phase 1 now represents the delivered owner-operated MVP: the coffee shop owner can run the prepaid cup membership program end-to-end from the admin portal without relying on customer-facing functionality.

## 2. Delivered Scope

Delivered:

- Admin authentication and logout.
- Admin route protection for `/admin/*`.
- Customer creation, duplicate prevention, list/search, and customer detail.
- Package purchase recording from fixed package sizes.
- Fixed pricing at `30.000 ₫` per purchased cup.
- Automatic amount calculation stored as `amount_paid_cents`.
- Bonus cup rules:
  - `10` purchased cups -> `11` credited cups.
  - `20` purchased cups -> `22` credited cups.
  - `30` purchased cups -> `33` credited cups.
- Balance management through transactional package and delivery updates.
- Multi-cup delivery recording.
- Blocking delivery at zero balance or above current balance.
- Delivery void/cancellation with balance restoration.
- Delivery records are retained and labelled when voided.
- Dashboard metrics for customers, outstanding cups, revenue, delivered cups, bonus cups, low-balance customers, and recent deliveries.
- VND currency formatting.
- Recent history previews with full-history pages:
  - Owner customer detail shows the 5 newest package purchases.
  - Owner customer detail shows the 5 newest deliveries.
  - Admin deliveries page is paginated newest first.
- Automated test coverage for core Phase 1 workflows.

Not part of Phase 1:

- Customer portal and customer login.
- Shared QR/balance-link customer access.
- Customer-facing notification UI.
- Advanced reporting.
- Production hardening beyond MVP route/session protection.
- Payment processing or POS integration.

Customer-facing and shared-link capabilities are documented in Phase 2 and enhancement artifacts.

## 3. Delivered Epics

| Epic | Delivered Status | Delivered Outcome |
|---|---|---|
| Epic 1: App Foundation | Implemented | Express app, local scripts, SQLite setup, static assets, route/model/view structure, config, migrations, and test harness are in place. |
| Epic 2: Owner Authentication | Implemented | Owner can log in and out; admin routes are protected; passwords are bcrypt hashed; session cookies use `httpOnly` and `sameSite: 'lax'`. |
| Epic 3: Customer Management | Implemented | Owner can create customers, prevent duplicate phone/login identifiers, search/list customers, and view customer detail. |
| Epic 4: Package Purchase And Balance Credits | Implemented | Owner records 10/20/30 cup packages; fixed VND pricing and bonus rules are calculated automatically; balance updates transactionally. |
| Epic 5: Delivery Recording And History | Implemented | Owner records positive integer delivery quantities, prevents over-delivery, sees delivery history, and can void mistaken deliveries with balance restoration. |
| Epic 6: Basic Owner Dashboard | Implemented | Dashboard shows operational metrics and recent activity needed to run the program. |

## 4. Retrospective Story Record

| Story | Delivered Status | Implementation Evidence |
|---|---|---|
| Story 1.1: Scaffold Express Application | Implemented | `server.js`, `/routes`, `/models`, `/middleware`, `/views`, `/public`, `npm run dev`. |
| Story 1.2: Add Environment Configuration | Implemented | `config.js`, environment defaults, `.env.example`, local database/session config. |
| Story 1.3: Create SQLite Schema And Setup Script | Implemented | `database/schema.sql`, `database/setup.js`, `database/migrations.js`. |
| Story 1.4: Add Database Connection Helper | Implemented | `database/database.js` with SQLite connection helpers and foreign keys. |
| Story 1.5: Implement Package Credit Calculation | Implemented | `models/cup-balance.js` implements `10 -> 11`, `20 -> 22`, `30 -> 33`. |
| Story 1.6: Add Foundation Tests | Implemented | `tests/customer-balance.test.js`, `npm test`. |
| Story 2.1: Add Password Hashing Utilities | Implemented | `models/password.js`, bcrypt hashing and verification. |
| Story 2.2: Seed Or Create Initial Admin User | Implemented | `models/admin-user.js`, setup/admin creation support. |
| Story 2.3: Implement Admin Login And Logout | Implemented | `/admin/login`, `/admin/logout`, `views/shared/admin-login.html`. |
| Story 2.4: Protect Admin Routes | Implemented | `middleware/auth.js`, protected `/admin/*` routes. |
| Story 2.5: Add Owner Auth Tests | Implemented | `tests/admin-auth.test.js`. |
| Story 3.1: Create Customer Account Model | Implemented | `models/customer-account.js`. |
| Story 3.2: Build Add Customer Form | Implemented | `/admin/customers/new`, `/admin/customers`. |
| Story 3.3: Prevent Duplicate Customer Accounts | Implemented | Unique constraints and duplicate handling for phone/login identifier. |
| Story 3.4: Build Customer List And Search | Implemented | `/admin/customers?q=...`. |
| Story 3.5: Build Customer Detail Page | Implemented | `/admin/customers/:customerId`. |
| Story 3.6: Add Customer Management Tests | Implemented | `tests/phase1-owner.test.js`. |
| Story 4.1: Create Package Purchase Model | Implemented | `models/package-purchase.js`. |
| Story 4.2: Build Record Package Purchase Form | Implemented | Customer detail package form with fixed package-size selection. |
| Story 4.3: Show Bonus Cup Calculation Before Save | Implemented | `public/js/admin.js` package preview for price, bonus, and total credited cups. |
| Story 4.4: Update Customer Balance Transactionally | Implemented | Package purchase insert and balance update occur in one transaction. |
| Story 4.5: Display Package Purchase History | Implemented | Owner detail preview plus full package history page. |
| Story 4.6: Add Package Purchase Tests | Implemented | Package and pricing coverage in `tests/phase1-owner.test.js`. |
| Story 5.1: Create Delivery History Model | Implemented | `models/delivery-history.js`. |
| Story 5.2: Build Record Delivery Action | Implemented | Customer detail delivery quantity form. |
| Story 5.3: Prevent Zero-Balance Delivery | Implemented | Server-side zero/insufficient balance checks plus disabled owner UI at zero balance. |
| Story 5.4: Display Admin Delivery History | Implemented | Customer detail preview, customer full delivery history, `/admin/deliveries` pagination. |
| Story 5.4A: Void Mistaken Delivery | Implemented | Owner-only void action restores balance and labels delivery as voided. |
| Story 5.5: Add Delivery Tests | Implemented | Multi-cup, over-balance, void, and dashboard exclusion tests. |
| Story 6.1: Build Basic Owner Dashboard | Implemented | `/admin/dashboard`. |
| Story 6.2: Add Dashboard Metric Queries | Implemented | `models/dashboard.js`. |
| Story 6.3: Add Basic Dashboard Tests | Implemented | Dashboard metric coverage in `tests/phase1-owner.test.js`. |

## 5. Data And Business Rules Delivered

- One purchased cup costs `30.000 ₫`.
- Stored package amount is calculated server-side as `package_size * 30.000 ₫` and persisted in `amount_paid_cents`.
- Package sizes are limited to `10`, `20`, and `30`.
- Bonus cups are calculated centrally and enforced server-side.
- Delivery quantity is a positive integer.
- Delivery quantity cannot exceed current balance.
- Package purchases and deliveries update customer balance inside database transactions.
- Voided deliveries remain in history and no longer count toward dashboard delivered-cup totals.

## 6. Route Surface Delivered

Admin routes delivered for Phase 1:

- `GET /admin/login`
- `POST /admin/login`
- `POST /admin/logout`
- `GET /admin/dashboard`
- `GET /admin/customers`
- `GET /admin/customers/new`
- `POST /admin/customers`
- `GET /admin/customers/:customerId`
- `POST /admin/customers/:customerId/package-purchases`
- `GET /admin/customers/:customerId/package-purchases`
- `POST /admin/customers/:customerId/deliveries`
- `GET /admin/customers/:customerId/deliveries`
- `POST /admin/deliveries/:deliveryId/void`
- `GET /admin/deliveries`

## 7. Testing Coverage Delivered

Automated tests are run with:

```sh
npm test
```

Current QA evidence:

- `30` tests passing.
- Admin authentication and logout.
- Admin route protection.
- Customer creation, duplicate checks, search, and protected routes.
- Package bonus rules and fixed VND pricing.
- Package purchase balance updates.
- Multi-cup delivery.
- Delivery quantity greater than balance blocked.
- Void delivery restores balance.
- Voided deliveries excluded from dashboard delivered-cup totals.
- Dashboard metrics.
- Admin delivery pagination newest first.
- Owner-managed customer password reset.

## 8. Implementation Status

Phase 1 Owner MVP status: Delivered / Implemented.

There is no remaining Phase 1 backlog required for the delivered MVP. Later customer-facing features are represented in Phase 2 artifacts.
