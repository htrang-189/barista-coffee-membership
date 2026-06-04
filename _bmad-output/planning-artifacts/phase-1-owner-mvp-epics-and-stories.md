# Phase 1 Owner MVP: Epics And Stories

Date: 2026-06-01
Project: barista-coffee-membership
Status: Draft

## 1. Scope

Phase 1 delivers the owner-operated MVP only. The coffee shop owner can run the membership program end-to-end without customer-facing functionality.

Included:

- Admin authentication.
- Customer management.
- Package purchase recording.
- Bonus cup calculation: `10 -> 11`, `20 -> 22`, `30 -> 33`.
- Balance tracking.
- Delivery recording.
- Multi-cup delivery quantities.
- Delivery void/cancel with balance restoration.
- Delivery history.
- Compact history previews with full-history pages.
- Basic owner dashboard metrics.

Excluded:

- Customer login.
- Customer self-service portal.
- Advanced reporting.
- Audit logs.
- Security hardening beyond MVP route/session protection.
- Production-readiness enhancements.

## 2. Implementation Order

| Order | Epic | Business Outcome |
|---|---|---|
| 1 | Epic 1: App Foundation | The app can run locally with the approved Express/SQLite structure. |
| 2 | Epic 2: Owner Authentication | The owner can log in and access protected admin screens. |
| 3 | Epic 3: Customer Management | The owner can create, find, and view customer accounts. |
| 4 | Epic 4: Package Purchase And Balance Credits | The owner can record prepaid packages and add correct credited cups. |
| 5 | Epic 5: Delivery Recording And History | The owner can record delivered cups and see usage history. |
| 6 | Epic 6: Basic Owner Dashboard | The owner can see basic operational metrics for daily use. |

## 3. Epic 1: App Foundation

### Goal

Create the local runnable Express/SQLite foundation needed for all owner workflows.

### Stories

#### Story 1.1: Scaffold Express Application

As a developer, I want the Express app scaffolded with the approved folder structure so owner features have a consistent implementation base.

Dependencies: None.

Acceptance criteria:

- `server.js` starts an Express v4 app.
- Static files are served from `/public`.
- Routes are organized under `/routes`.
- Middleware is organized under `/middleware`.
- Models/business logic are organized under `/models`.
- Views are organized under `/views`.
- App can be started locally with `npm run dev`.

#### Story 1.2: Add Environment Configuration

As a developer, I want environment configuration so local setup is predictable.

Dependencies: Story 1.1.

Acceptance criteria:

- `.env.example` documents `NODE_ENV`, `PORT`, `DATABASE_PATH`, `SESSION_SECRET`, and `BCRYPT_ROUNDS`.
- App reads configuration from environment variables.
- Local defaults are safe for development.
- `.env` is ignored by Git.

#### Story 1.3: Create SQLite Schema And Setup Script

As a developer, I want the database schema and setup script so the owner MVP can be initialized locally.

Dependencies: Story 1.1.

Acceptance criteria:

- `/database/schema.sql` creates `admin_users`, `customer_accounts`, `package_purchases`, and `delivery_history`.
- Schema uses snake_case table and column names.
- Foreign keys are defined.
- Required indexes are created for customer lookup and history queries.
- `/database/setup.js` initializes the SQLite database from `schema.sql`.

#### Story 1.4: Add Database Connection Helper

As a developer, I want a reusable SQLite helper so database operations are consistent and safe.

Dependencies: Story 1.3.

Acceptance criteria:

- `/database/database.js` opens the configured SQLite database.
- Foreign keys are enabled for each connection.
- Helper supports prepared statements.
- Database errors are caught and logged with context.

#### Story 1.5: Implement Package Credit Calculation

As the owner, I need package credits calculated correctly so customer balances are accurate.

Dependencies: None.

Acceptance criteria:

- `calculatePackageCredits(10)` returns `bonusCups = 1` and `totalCupsAdded = 11`.
- `calculatePackageCredits(20)` returns `bonusCups = 2` and `totalCupsAdded = 22`.
- `calculatePackageCredits(30)` returns `bonusCups = 3` and `totalCupsAdded = 33`.
- Invalid package sizes are rejected with a meaningful business error.
- Logic lives in `/models/cup-balance.js`.

#### Story 1.6: Add Foundation Tests

As a developer, I want initial tests so package credit rules are protected before owner workflows depend on them.

Dependencies: Story 1.5.

Acceptance criteria:

- Test runner is configured.
- Tests cover package credit calculations for 10, 20, and 30.
- Tests cover invalid package size rejection.
- Tests run with `npm test`.

## 4. Epic 2: Owner Authentication

### Goal

Protect owner-only screens and operations with a simple admin login/logout flow.

### Stories

#### Story 2.1: Add Password Hashing Utilities

As a developer, I want bcrypt helper functions so admin passwords are never stored or compared in plain text.

Dependencies: Story 1.2.

Acceptance criteria:

- Password hashing uses bcrypt.
- Password verification uses bcrypt comparison.
- Bcrypt rounds come from configuration.
- No route stores plain text passwords.

#### Story 2.2: Seed Or Create Initial Admin User

As the owner, I need an initial admin account so I can log in to the owner MVP.

Dependencies: Story 1.3, Story 2.1.

Acceptance criteria:

- Setup process can create an initial admin user.
- Admin password is stored as a bcrypt hash.
- Duplicate admin usernames are prevented.
- Setup instructions are documented in local development notes or README.

#### Story 2.3: Implement Admin Login And Logout

As the owner, I want to log in and out so membership management is not publicly accessible.

Dependencies: Story 2.1, Story 2.2.

Acceptance criteria:

- `GET /admin/login` renders admin login.
- `POST /admin/login` validates credentials.
- Valid login creates an admin session.
- Invalid login shows a generic error.
- `POST /admin/logout` clears the session.

#### Story 2.4: Protect Admin Routes

As the owner, I want admin screens protected so only logged-in admins can operate the program.

Dependencies: Story 2.3.

Acceptance criteria:

- `requireAdmin` middleware protects `/admin/*` routes.
- Unauthenticated users are redirected to `/admin/login`.
- Authenticated admin can access `/admin/dashboard`.
- Session cookies are `httpOnly` and `sameSite: 'lax'`.
- Customer authentication is not implemented in Phase 1.

#### Story 2.5: Add Owner Auth Tests

As a developer, I want admin auth tests so owner route protection remains reliable.

Dependencies: Story 2.3, Story 2.4.

Acceptance criteria:

- Admin login success is tested.
- Admin login failure is tested.
- Unauthenticated admin route access is rejected or redirected.
- Logout clears the session.

## 5. Epic 3: Customer Management

### Goal

Allow the owner to create, find, and view customer accounts from the admin area.

### Stories

#### Story 3.1: Create Customer Account Model

As a developer, I want customer account model functions so route handlers stay small and readable.

Dependencies: Story 1.4.

Acceptance criteria:

- Model can create a customer account.
- Model can find a customer by id.
- Model can find a customer by login identifier.
- Model can search customers by name, phone, or login identifier.
- Database operations use prepared statements.

#### Story 3.2: Build Add Customer Form

As the owner, I want to create customer accounts so membership balances can be tracked.

Dependencies: Story 2.4, Story 3.1.

Acceptance criteria:

- `/admin/customers/new` renders the add customer form.
- Form includes name, phone, optional email, login identifier, and password.
- Name, phone, login identifier, and password are required.
- Password is stored as a bcrypt hash.
- Successful creation redirects to the customer detail page.

#### Story 3.3: Prevent Duplicate Customer Accounts

As the owner, I want duplicate prevention so customer balances are not split across accounts.

Dependencies: Story 3.1, Story 3.2.

Acceptance criteria:

- Duplicate phone is blocked.
- Duplicate login identifier is blocked.
- Server validation catches duplicates before insert when possible.
- Database constraints enforce uniqueness.
- User-facing duplicate errors are clear and non-technical.

#### Story 3.4: Build Customer List And Search

As the owner, I want to find customers quickly so I can manage memberships during shop operations.

Dependencies: Story 3.1, Story 3.2.

Acceptance criteria:

- `/admin/customers` lists customers.
- List shows name, phone, email when present, current balance, and low-balance status.
- Search supports name, phone, and login identifier.
- Empty results show a clear message.
- Customer rows link to customer detail.

#### Story 3.5: Build Customer Detail Page

As the owner, I want a customer detail page so I can see account information and balance state.

Dependencies: Story 3.1, Story 3.4.

Acceptance criteria:

- `/admin/customers/:customerId` shows customer name, phone, email, login identifier, and current balance.
- Current balance is prominent.
- Low-balance warning appears when balance is `<= 5`.
- Package purchase history section exists.
- Delivery history section exists.
- No customer-facing portal links are shown in Phase 1.

#### Story 3.6: Add Customer Management Tests

As a developer, I want tests for customer management so account creation and lookup stay reliable.

Dependencies: Story 3.1 through Story 3.5.

Acceptance criteria:

- Customer creation test passes.
- Duplicate phone test passes.
- Duplicate login identifier test passes.
- Customer search test passes.
- Protected customer management route test passes.

## 6. Epic 4: Package Purchase And Balance Credits

### Goal

Allow the owner to record package purchases and update customer balances with the correct credited cups.

### Stories

#### Story 4.1: Create Package Purchase Model

As a developer, I want package purchase model functions so package recording is centralized.

Dependencies: Story 1.4, Story 1.5, Story 3.1.

Acceptance criteria:

- Model records customer id, package size, bonus cups, total cups added, calculated amount paid, admin id, and timestamp.
- Model rejects invalid package sizes.
- Model calculates amount paid at `30.000 ₫` per purchased cup.
- Model stores amount as cents.
- Model uses prepared statements.

#### Story 4.2: Build Record Package Purchase Form

As the owner, I want to record a package purchase so a customer receives credited cups.

Dependencies: Story 3.5, Story 4.1.

Acceptance criteria:

- Form appears on customer detail.
- Package size choices are only 10, 20, and 30.
- Manual amount entry is not shown.
- Calculated amount paid is displayed before save.
- Submit creates a package purchase.
- Successful save returns to customer detail with updated balance.

#### Story 4.3: Show Bonus Cup Calculation Before Save

As the owner, I want to see bonus cup calculation before saving so I can confirm the package is correct.

Dependencies: Story 4.2.

Acceptance criteria:

- Selecting 10 shows 1 bonus cup and 11 total cups.
- Selecting 20 shows 2 bonus cups and 22 total cups.
- Selecting 30 shows 3 bonus cups and 33 total cups.
- Selecting 10 shows calculated amount `300.000 ₫`.
- Selecting 20 shows calculated amount `600.000 ₫`.
- Selecting 30 shows calculated amount `900.000 ₫`.
- The same calculation is enforced server-side.

#### Story 4.4: Update Customer Balance Transactionally

As a developer, I want package purchase and balance update in one transaction so balances cannot drift from purchase history.

Dependencies: Story 4.1, Story 4.2.

Acceptance criteria:

- Package insert and customer balance update happen in one SQLite transaction.
- Rollback occurs if either step fails.
- Customer current balance increases by total cups added.
- Refreshing customer detail shows the updated balance and purchase history.

#### Story 4.5: Display Package Purchase History

As the owner, I want to see package purchase history so I can explain how a balance was built.

Dependencies: Story 4.4.

Acceptance criteria:

- Customer detail shows package purchase history.
- History shows package size, bonus cups, total cups added, amount paid, admin actor, and date.
- Customer detail shows the 5 newest purchases by default.
- A `View All` link opens complete package purchase history newest first.
- Empty history state is clear.

#### Story 4.6: Add Package Purchase Tests

As a developer, I want tests for package purchases so bonus and balance rules stay correct.

Dependencies: Story 4.1 through Story 4.5.

Acceptance criteria:

- 10 package adds 11 cups.
- 20 package adds 22 cups.
- 30 package adds 33 cups.
- Invalid package size is rejected.
- Balance update occurs with purchase insert.
- Calculated VND amount is stored automatically.
- Transaction rollback behavior is tested.

## 7. Epic 5: Delivery Recording And History

### Goal

Allow the owner to record delivered cups, prevent negative balances, and view delivery history.

### Stories

#### Story 5.1: Create Delivery History Model

As a developer, I want delivery model functions so delivery recording is reliable.

Dependencies: Story 1.4, Story 3.1.

Acceptance criteria:

- Model records customer id, delivered cups, balance after, note, admin id, and delivery date.
- Delivered cups is a positive integer.
- Model supports voiding a delivery with balance restoration.
- Model blocks voiding the same delivery twice.
- Delivery history query returns newest first.
- Database operations use prepared statements.

#### Story 5.2: Build Record Delivery Action

As the owner, I want to record delivered cup quantity quickly so counter service stays fast.

Dependencies: Story 3.5, Story 5.1.

Acceptance criteria:

- Customer detail includes a prominent record delivery action.
- Delivery quantity defaults to 1.
- Delivery quantity must be a positive integer.
- Optional note can be included.
- Successful delivery decreases balance by delivered cup quantity.
- Successful delivery appears in delivery history.
- Current balance updates after delivery.

#### Story 5.3: Prevent Zero-Balance Delivery

As the owner, I need delivery blocked at zero balance so balances never go negative.

Dependencies: Story 5.2.

Acceptance criteria:

- Delivery button is disabled or clearly blocked when balance is 0.
- Server blocks delivery when balance is 0.
- Server blocks delivery quantity greater than current balance.
- Balance is rechecked inside the database transaction.
- User sees a clear warning when delivery cannot be recorded.
- No negative balance can be created.

#### Story 5.4: Display Admin Delivery History

As the owner, I want delivery history so I can audit customer usage.

Dependencies: Story 5.2, Story 5.3.

Acceptance criteria:

- Customer detail shows deliveries in reverse chronological order.
- Each row shows delivery date/time, delivered cups, balance after, admin actor, and note when present.
- Customer detail shows the 5 newest deliveries by default.
- A `View All` link opens complete delivery history newest first.
- Voided deliveries remain visible and clearly labelled.
- Empty delivery history state is clear.

#### Story 5.4A: Void Mistaken Delivery

As the owner, I want to void a mistaken delivery so I can correct balance without deleting history.

Dependencies: Story 5.2, Story 5.4.

Acceptance criteria:

- Owner can void a non-voided delivery.
- Voiding restores delivered cups to current balance.
- Voided delivery remains in history and is labelled voided/cancelled.
- Same delivery cannot be voided twice.
- Dashboard delivered-cup totals exclude voided deliveries.

#### Story 5.5: Add Delivery Tests

As a developer, I want delivery tests so balance and delivery rules stay safe.

Dependencies: Story 5.1 through Story 5.4.

Acceptance criteria:

- Delivery quantity `1` decreases balance by 1.
- Delivery quantity greater than 1 decreases balance by that quantity.
- Delivery at zero balance is blocked.
- Delivery quantity greater than balance is blocked.
- Void delivery restores balance.
- Voided delivery does not count in dashboard delivered-cup totals.
- Delivery and balance update are transactional.
- Delivery history is newest first.
- Admin delivery route rejects unauthenticated requests.

## 8. Epic 6: Basic Owner Dashboard Metrics

### Goal

Give the owner a simple dashboard for operating the program without implementing the full reporting phase.

### Stories

#### Story 6.1: Build Basic Owner Dashboard

As the owner, I want a basic dashboard so I can quickly understand membership status.

Dependencies: Story 3.4, Story 4.4, Story 5.2.

Acceptance criteria:

- `/admin/dashboard` is protected by admin authentication.
- Dashboard shows total customer accounts.
- Dashboard shows total outstanding cup balance.
- Dashboard shows recorded package revenue.
- Dashboard shows total cups delivered.
- Dashboard shows low-balance customers.
- Dashboard shows recent deliveries.
- Dashboard links to customer list and add customer.

#### Story 6.2: Add Dashboard Metric Queries

As a developer, I want dashboard metric model functions so dashboard calculations are centralized.

Dependencies: Story 6.1.

Acceptance criteria:

- Metric function returns total customer accounts.
- Metric function returns total outstanding cup balance.
- Metric function returns recorded package revenue.
- Metric function returns total cups delivered.
- Metric function returns low-balance customers.
- Metric function returns recent deliveries.
- Queries use prepared statements or safe static SQL.

#### Story 6.3: Add Basic Dashboard Tests

As a developer, I want tests for dashboard metrics so the owner sees reliable numbers.

Dependencies: Story 6.2.

Acceptance criteria:

- Total customer accounts test passes.
- Outstanding cup balance test passes.
- Recorded package revenue test passes.
- Total cups delivered test passes.
- Low-balance customers test passes.
- Recent deliveries test passes.

## 9. Phase 1 Completion Criteria

Phase 1 is complete when the owner-operated MVP slice is complete. Later Phase 2 work adds the customer portal and shared balance-link functionality that exists in the current full application.

- Owner can log in and log out.
- Owner can create and find customers.
- Duplicate phone and duplicate login identifier are blocked.
- Owner can record 10, 20, and 30 cup packages.
- Bonus cup rules are applied correctly.
- Customer balance increases after package purchase.
- Owner can record delivered-cup quantities.
- Delivery is blocked at zero balance.
- Customer detail shows balance, package history, and delivery history.
- Basic dashboard metrics are visible.
- Phase 1 automated tests pass.
- Customer login and self-service are outside Phase 1 and are implemented in later Phase 2 artifacts.

## 10. Out Of Scope For Phase 1

- Customer login.
- Customer balance portal.
- Customer route protection.
- Advanced reports page.
- Audit log UI or formal audit trail.
- CSRF hardening.
- Production deployment documentation.
- SQLite backup automation.
- Multi-shop support.
- Payment processing.
- POS integration.
