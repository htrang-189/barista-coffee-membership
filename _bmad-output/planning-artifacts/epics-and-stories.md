# Epics And Stories: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Draft

## 1. Purpose

This document breaks the approved architecture into implementation phases, epics, and stories. Each phase is designed to produce a working and testable application state so the project can be built incrementally.

Source inputs:

- Project Context: `_bmad-output/project-context.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- PRD: `_bmad-output/planning-artifacts/prd.md`
- UX Design: `_bmad-output/planning-artifacts/ux-design.md`

## 2. Delivery Phase Summary

| Phase | Name | Goal | Estimated Effort | Expected Deliverable |
|---|---|---|---|---|
| 1 | Foundation And Database | Create the runnable Express app, SQLite schema, setup scripts, and core business logic tests. | 2-3 days | App starts locally, database initializes, package credit rules are tested. |
| 2 | Authentication And Route Protection | Add admin/customer login, sessions, logout, middleware, and route separation. | 2-3 days | Admin and customer protected areas exist and reject unauthorized access. |
| 3 | Admin Customer Management | Let admins create, list, search, and view customer accounts. | 2-3 days | Admin can manage customer accounts with duplicate prevention. |
| 4 | Package Purchases And Balance Updates | Record packages, apply bonus cup rules, update balances transactionally, and show package history. | 2-3 days | Admin can add credited cups through package purchases. |
| 5 | Delivery Recording And Customer View | Record deliveries, prevent negative balances, show delivery history, and support customer balance view. | 3-4 days | Admin can record delivered cups; customers can log in and view their own balance/history. |
| 6 | Dashboard, Reports, Hardening, Deployment | Add reports, dashboard metrics, audit logging, backups/deployment docs, and final test coverage. | 3-5 days | MVP is deployable, tested, and ready for pilot use. |

Effort estimates assume one developer working in the approved simple Express/SQLite stack.

## 3. Phase 1: Foundation And Database

### Goal

Create a local runnable application foundation with the approved folder structure, SQLite schema, database setup, and core coffee business logic.

### Estimated Implementation Effort

2-3 days.

### Included Epics

- Epic 1: Application Foundation
- Epic 2: Database Foundation
- Epic 3: Core Coffee Business Logic

### Included Stories

- Story 1.1: Scaffold Express Application
- Story 1.2: Add Environment Configuration
- Story 1.3: Create SQLite Schema And Setup Script
- Story 1.4: Add Database Connection Helper
- Story 1.5: Implement Package Credit Calculation
- Story 1.6: Add Foundation Tests

### Expected Deliverable

A runnable local app with a health page or basic route, initialized SQLite database, schema setup script, sample data support, and passing tests for package credit rules.

### Stories

#### Story 1.1: Scaffold Express Application

As a developer, I want the Express app scaffolded with the approved folder structure so future features have a consistent home.

Acceptance criteria:

- `server.js` starts an Express v4 app.
- Static files are served from `/public`.
- Routes are organized under `/routes`.
- Middleware is organized under `/middleware`.
- Models are organized under `/models`.
- Views are organized under `/views`.
- App can be started with `npm run dev`.

#### Story 1.2: Add Environment Configuration

As a developer, I want environment configuration so local and production settings are clear.

Acceptance criteria:

- `.env.example` documents `NODE_ENV`, `PORT`, `DATABASE_PATH`, `SESSION_SECRET`, and `BCRYPT_ROUNDS`.
- App reads config from environment variables.
- Missing critical config has a clear developer-facing error or safe default for local development.
- `.env` is ignored by Git.

#### Story 1.3: Create SQLite Schema And Setup Script

As a developer, I want the SQLite schema and setup script so the database can be recreated locally.

Acceptance criteria:

- `/database/schema.sql` creates `admin_users`, `customer_accounts`, `package_purchases`, `delivery_history`, and `admin_action_logs`.
- Schema uses snake_case table and column names.
- Foreign keys are defined.
- Required indexes are created.
- `/database/setup.js` initializes the database from `schema.sql`.

#### Story 1.4: Add Database Connection Helper

As a developer, I want a reusable SQLite connection helper so database access is consistent.

Acceptance criteria:

- `/database/database.js` opens the configured SQLite database.
- Foreign keys are enabled for each connection.
- Helper exposes prepared statement/query helpers.
- Database errors are logged with context.

#### Story 1.5: Implement Package Credit Calculation

As an admin, I need package credits calculated consistently so balances are always correct.

Acceptance criteria:

- `calculatePackageCredits(10)` returns 1 bonus cup and 11 total cups.
- `calculatePackageCredits(20)` returns 2 bonus cups and 22 total cups.
- `calculatePackageCredits(30)` returns 0 bonus cups and 30 total cups.
- Invalid package sizes throw a meaningful business error.
- Function lives in `/models/cup-balance.js`.

#### Story 1.6: Add Foundation Tests

As a developer, I want initial automated tests so the critical business rules are protected.

Acceptance criteria:

- Test runner is configured.
- `/tests/customer-balance.test.js` covers package credit calculations.
- Invalid package size tests are included.
- Tests run with `npm test`.

## 4. Phase 2: Authentication And Route Protection

### Goal

Implement secure admin and customer authentication with session-based route protection and clear route separation.

### Estimated Implementation Effort

2-3 days.

### Included Epics

- Epic 4: Authentication
- Epic 5: Authorization And Security Middleware

### Included Stories

- Story 2.1: Add Password Hashing Utilities
- Story 2.2: Implement Admin Login And Logout
- Story 2.3: Implement Customer Login And Logout
- Story 2.4: Add Session And Auth Middleware
- Story 2.5: Add CSRF Protection For Forms
- Story 2.6: Add Auth Tests

### Expected Deliverable

A runnable app with admin and customer login pages, protected `/admin/*` and `/customer/*` routes, logout flows, and tests verifying access control.

### Stories

#### Story 2.1: Add Password Hashing Utilities

As a developer, I want bcrypt helper functions so passwords are never stored or compared in plain text.

Acceptance criteria:

- Password hashing uses bcrypt.
- Password verification uses bcrypt comparison.
- Bcrypt rounds come from configuration.
- No route stores plain text passwords.

#### Story 2.2: Implement Admin Login And Logout

As an admin, I want to log in and out so admin operations are protected.

Acceptance criteria:

- `GET /admin/login` renders admin login.
- `POST /admin/login` validates credentials.
- Valid login creates an admin session.
- Invalid login shows a generic error.
- `POST /admin/logout` clears the session.

#### Story 2.3: Implement Customer Login And Logout

As a customer, I want to log in and out so I can securely view my own account.

Acceptance criteria:

- `GET /customer/login` renders customer login.
- `POST /customer/login` validates credentials.
- Valid login creates a customer session.
- Invalid login shows a generic error.
- `POST /customer/logout` clears the session.

#### Story 2.4: Add Session And Auth Middleware

As a developer, I want route protection middleware so admin and customer access stays separated.

Acceptance criteria:

- `requireAdmin` protects `/admin/*` routes.
- `requireCustomer` protects `/customer/*` routes.
- Customers cannot access admin routes.
- Unauthenticated users are redirected to the correct login page.
- Session cookies are `httpOnly`, `sameSite: 'lax'`, and secure in production.

#### Story 2.5: Add CSRF Protection For Forms

As a developer, I want CSRF protection so authenticated form posts are protected.

Acceptance criteria:

- Form pages include a CSRF token.
- Protected POST routes validate the CSRF token.
- Invalid CSRF token returns a safe error.
- Logout forms also include CSRF protection.

#### Story 2.6: Add Auth Tests

As a developer, I want auth tests so access control regressions are caught.

Acceptance criteria:

- Admin login success and failure are tested.
- Customer login success and failure are tested.
- Customer cannot access `/admin/*`.
- Unauthenticated users cannot access protected routes.
- Logout clears session.

## 5. Phase 3: Admin Customer Management

### Goal

Allow admins to create customer accounts, prevent duplicates, list/search customers, and view customer details.

### Estimated Implementation Effort

2-3 days.

### Included Epics

- Epic 6: Customer Account Management
- Epic 7: Admin Customer Views

### Included Stories

- Story 3.1: Create Customer Account Model
- Story 3.2: Build Add Customer Form
- Story 3.3: Prevent Duplicate Customer Accounts
- Story 3.4: Build Customer List And Search
- Story 3.5: Build Customer Detail Page
- Story 3.6: Add Customer Management Tests

### Expected Deliverable

Admin can log in, create authenticated customer accounts, see customer lists, search by name/phone/login identifier, and open customer detail pages.

### Stories

#### Story 3.1: Create Customer Account Model

As a developer, I want customer account model functions so route handlers stay simple.

Acceptance criteria:

- Model can create a customer account.
- Model can find customer by id.
- Model can find customer by login identifier.
- Model can search customers by name, phone, or login identifier.
- Database operations use prepared statements.

#### Story 3.2: Build Add Customer Form

As an admin, I want to create customer accounts so members can log in and have balances tracked.

Acceptance criteria:

- Form includes name, phone, optional email, login identifier, and password.
- Required fields are validated client-side and server-side.
- Password is stored as a bcrypt hash.
- Successful creation redirects to customer detail.
- User-facing errors are clear.

#### Story 3.3: Prevent Duplicate Customer Accounts

As an admin, I want duplicate prevention so balances are not split across accounts.

Acceptance criteria:

- Duplicate phone is blocked.
- Duplicate login identifier is blocked.
- Error messages do not expose technical database details.
- Duplicate checks are enforced by database constraints and server validation.

#### Story 3.4: Build Customer List And Search

As an admin, I want to find customers quickly so I can manage them during shop operations.

Acceptance criteria:

- `/admin/customers` lists customers.
- List shows name, phone, email when present, current balance, and low-balance status.
- Search supports name, phone, and login identifier.
- Empty results show a clear message.

#### Story 3.5: Build Customer Detail Page

As an admin, I want a customer detail page so I can see account information and balance state.

Acceptance criteria:

- Page shows customer name, phone, email, login identifier, and current balance.
- Low-balance warning appears when balance is `<= 5`.
- Package and delivery history sections exist, even if empty.
- Admin-only actions are visible only in admin area.

#### Story 3.6: Add Customer Management Tests

As a developer, I want tests for customer management so account creation remains reliable.

Acceptance criteria:

- Customer creation test passes.
- Duplicate phone test passes.
- Duplicate login identifier test passes.
- Search test passes.
- Protected customer management route tests pass.

## 6. Phase 4: Package Purchases And Balance Updates

### Goal

Allow admins to record package purchases, apply bonus cup rules, update balances in database transactions, and display package history.

### Estimated Implementation Effort

2-3 days.

### Included Epics

- Epic 8: Package Purchase Recording
- Epic 9: Balance Integrity

### Included Stories

- Story 4.1: Create Package Purchase Model
- Story 4.2: Build Record Package Purchase Form
- Story 4.3: Show Bonus Cup Calculation Before Save
- Story 4.4: Update Customer Balance Transactionally
- Story 4.5: Display Package Purchase History
- Story 4.6: Add Package Purchase Tests

### Expected Deliverable

Admin can record 10, 20, or 30 cup packages, see correct credited cups, and customer balances update reliably with package history visible.

### Stories

#### Story 4.1: Create Package Purchase Model

As a developer, I want package purchase model functions so package recording is centralized.

Acceptance criteria:

- Model records package size, bonus cups, total cups added, amount paid, admin id, and timestamp.
- Model rejects invalid package sizes.
- Model stores amount as cents.
- Model uses prepared statements.

#### Story 4.2: Build Record Package Purchase Form

As an admin, I want to record a package purchase so a customer receives credited cups.

Acceptance criteria:

- Form appears on customer detail.
- Package size choices are only 10, 20, and 30.
- Amount paid can be entered.
- Submit creates a package purchase.
- Successful save returns to customer detail with updated balance.

#### Story 4.3: Show Bonus Cup Calculation Before Save

As an admin, I want to see bonus cup calculation before saving so I can confirm the package is correct.

Acceptance criteria:

- Selecting 10 shows 1 bonus cup and 11 total cups.
- Selecting 20 shows 2 bonus cups and 22 total cups.
- Selecting 30 shows 0 bonus cups and 30 total cups.
- Calculation is also enforced server-side.

#### Story 4.4: Update Customer Balance Transactionally

As a developer, I want package purchase and balance update in one transaction so data cannot drift.

Acceptance criteria:

- Package insert and balance update happen in one SQLite transaction.
- Rollback occurs if either step fails.
- Admin action log is recorded when purchase succeeds.
- Customer current balance increases by total cups added.

#### Story 4.5: Display Package Purchase History

As an admin, I want to see package purchase history so I can explain how a balance was built.

Acceptance criteria:

- Customer detail shows package purchase history.
- History shows package size, bonus cups, total cups added, amount paid, admin actor, and date.
- Newest purchases are easy to scan.

#### Story 4.6: Add Package Purchase Tests

As a developer, I want tests for package purchases so bonus and balance rules stay correct.

Acceptance criteria:

- 10 package adds 11 cups.
- 20 package adds 22 cups.
- 30 package adds 30 cups.
- Invalid package size is rejected.
- Transaction rollback behavior is tested.

## 7. Phase 5: Delivery Recording And Customer View

### Goal

Allow admins to record delivered cups, prevent negative balances, display delivery history, and give customers a secure read-only view of their own balance and histories.

### Estimated Implementation Effort

3-4 days.

### Included Epics

- Epic 10: Delivery Recording
- Epic 11: Customer Balance View

### Included Stories

- Story 5.1: Create Delivery History Model
- Story 5.2: Build Record Delivery Action
- Story 5.3: Prevent Zero-Balance Delivery
- Story 5.4: Display Admin Delivery History
- Story 5.5: Build Customer Balance Page
- Story 5.6: Add Delivery And Customer View Tests

### Expected Deliverable

Admin can record one-cup deliveries safely. Customers can log in and see only their own current balance, package history, and delivery history.

### Stories

#### Story 5.1: Create Delivery History Model

As a developer, I want delivery model functions so delivery recording is reliable.

Acceptance criteria:

- Model records customer id, delivered cups, balance after, note, admin id, and delivery date.
- Delivered cups is always `1`.
- Delivery history query returns newest first.
- Database operations use prepared statements.

#### Story 5.2: Build Record Delivery Action

As an admin, I want to record one delivered cup quickly so counter service stays fast.

Acceptance criteria:

- Customer detail includes a prominent record delivery action.
- Optional note can be included.
- Successful delivery decreases balance by 1.
- Successful delivery appears in delivery history.
- Current balance updates after delivery.

#### Story 5.3: Prevent Zero-Balance Delivery

As an admin, I need delivery blocked at zero balance so balances never go negative.

Acceptance criteria:

- Delivery button is disabled or clearly blocked when balance is 0.
- Server also blocks delivery when balance is 0.
- Balance is rechecked inside the database transaction.
- User sees a clear warning when delivery cannot be recorded.

#### Story 5.4: Display Admin Delivery History

As an admin, I want delivery history so I can audit customer usage.

Acceptance criteria:

- Customer detail shows deliveries in reverse chronological order.
- Each row shows delivery date/time, delivered cups, balance after, admin actor, and note when present.
- Recent deliveries are visible on dashboard placeholder or dashboard section if already available.

#### Story 5.5: Build Customer Balance Page

As a customer, I want to view my own balance and histories so I can verify my membership.

Acceptance criteria:

- `/customer/balance` loads customer id from the session.
- Page shows customer name and current balance prominently.
- Low-balance warning appears when balance is `<= 5`.
- Page shows package purchase history.
- Page shows delivery history newest first.
- Page does not show admin actions or other customers' data.

#### Story 5.6: Add Delivery And Customer View Tests

As a developer, I want tests for delivery and customer views so balance and access rules stay safe.

Acceptance criteria:

- Delivery decreases balance by 1.
- Delivery at zero balance is blocked.
- Delivery and balance update are transactional.
- Customer can access own balance page.
- Customer cannot access another customer's data.
- Customer cannot access admin delivery routes.

## 8. Phase 6: Dashboard, Reports, Hardening, Deployment

### Goal

Complete the operational dashboard and reports, improve error handling/security, add final tests, and prepare the app for deployment.

### Estimated Implementation Effort

3-5 days.

### Included Epics

- Epic 12: Dashboard And Reporting
- Epic 13: Error Handling And Audit Logging
- Epic 14: Deployment Readiness
- Epic 15: Final QA

### Included Stories

- Story 6.1: Build Admin Dashboard Metrics
- Story 6.2: Build Reports Page
- Story 6.3: Add Admin Action Logging
- Story 6.4: Add User-Friendly Error Handling
- Story 6.5: Add Deployment Configuration And Docs
- Story 6.6: Complete Final Test Coverage

### Expected Deliverable

The MVP is complete enough for pilot use: admin dashboard and reports work, core flows are tested, deployment configuration is documented, and the app can be deployed to Railway or Render with SQLite backups.

### Stories

#### Story 6.1: Build Admin Dashboard Metrics

As an admin, I want dashboard metrics so I can see membership health quickly.

Acceptance criteria:

- Dashboard shows total customer accounts.
- Dashboard shows total outstanding cup balance.
- Dashboard shows recorded package revenue.
- Dashboard shows total bonus cups granted.
- Dashboard shows total cups delivered.
- Dashboard shows low balance customers.
- Dashboard shows recent deliveries.

#### Story 6.2: Build Reports Page

As an admin, I want reports so I can review package and delivery activity.

Acceptance criteria:

- Reports show package purchases by package size.
- Reports show total recorded package revenue.
- Reports show total bonus cups granted.
- Reports show total cups added.
- Reports show total cups delivered.
- Reports show total outstanding cup balance.
- Revenue is labeled as recorded package revenue.

#### Story 6.3: Add Admin Action Logging

As the shop owner, I want admin actions logged so important changes can be audited.

Acceptance criteria:

- Customer creation logs an admin action.
- Package purchase recording logs an admin action.
- Delivery recording logs an admin action.
- Logs include admin id, action type, target type/id, message, and timestamp.

#### Story 6.4: Add User-Friendly Error Handling

As a user, I want clear error messages so I know what went wrong without seeing technical details.

Acceptance criteria:

- Database errors are logged server-side.
- Users see safe messages for failures.
- Validation errors appear near relevant form fields where practical.
- App does not crash on handled business errors.
- Shared error view exists.

#### Story 6.5: Add Deployment Configuration And Docs

As a developer, I want deployment documentation so the app can be run on Railway or Render.

Acceptance criteria:

- README documents local setup.
- README documents required environment variables.
- README documents database setup.
- README documents Railway/Render deployment notes.
- SQLite backup approach is documented.
- Health check endpoint exists.

#### Story 6.6: Complete Final Test Coverage

As a developer, I want final test coverage so the MVP can be changed safely.

Acceptance criteria:

- Reporting tests pass.
- Auth tests pass.
- Customer management tests pass.
- Package purchase tests pass.
- Delivery tests pass.
- Manual smoke test checklist is documented and completed.

## 9. Epic List

### Epic 1: Application Foundation

Establish the Express app, approved folders, static serving, scripts, and basic runnable route.

### Epic 2: Database Foundation

Create SQLite schema, setup scripts, sample data support, connection helper, and foreign key enforcement.

### Epic 3: Core Coffee Business Logic

Centralize package credit calculations, low-balance logic, and balance-related helper behavior.

### Epic 4: Authentication

Implement bcrypt password handling, admin login/logout, customer login/logout, and secure sessions.

### Epic 5: Authorization And Security Middleware

Protect `/admin/*` and `/customer/*`, add CSRF protection, and enforce role separation.

### Epic 6: Customer Account Management

Support customer creation, duplicate prevention, account lookup, and customer model operations.

### Epic 7: Admin Customer Views

Build admin customer list, search, detail, balance display, and low-balance UI.

### Epic 8: Package Purchase Recording

Record package purchases, validate package size, calculate bonus cups, and show package history.

### Epic 9: Balance Integrity

Ensure package and delivery balance changes use SQLite transactions and cannot drift from history.

### Epic 10: Delivery Recording

Record one-cup deliveries, prevent zero-balance delivery, and show delivery history.

### Epic 11: Customer Balance View

Provide authenticated customer balance, package history, and delivery history without admin access.

### Epic 12: Dashboard And Reporting

Implement admin dashboard metrics and reports required by the Project Context and PRD.

### Epic 13: Error Handling And Audit Logging

Add safe error messages, server-side logging, and admin action logs.

### Epic 14: Deployment Readiness

Prepare environment docs, startup scripts, health checks, and SQLite backup/deployment guidance.

### Epic 15: Final QA

Complete automated tests and manual smoke testing for pilot readiness.

## 10. Cross-Phase Rules

- Use vanilla HTML/CSS/JavaScript only.
- Use Express.js routes under `/routes`.
- Use business logic under `/models`.
- Use prepared statements for all SQL.
- Use database transactions for package purchase and delivery recording.
- Use bcrypt for passwords.
- Use express-session for admin/customer sessions.
- Protect every `/admin/*` and `/customer/*` route server-side.
- Never expose admin functions in customer UI.
- Keep current cup balance prominent.
- Display delivery history in reverse chronological order.
- Use clear, user-friendly errors.
- Include tests with each phase.

## 11. Recommended Next Step

Use Phase 1 as the first implementation scope. Do not start later phases until Phase 1 is runnable locally and its tests pass.
