# Phase 1 Owner MVP: Full BMAD Retrospective Implementation Artifact

Date: 2026-06-05
Status: Implemented / Delivered
Artifact Type: Retrospective BMAD implementation history generated after delivery

## Phase

Phase 1 Owner MVP delivered the owner/admin side of the Barista Coffee Membership web application. The owner can operate the prepaid cup program end-to-end from the admin portal, including customer management, package purchase recording, balance updates, multi-cup delivery recording, delivery voiding, dashboard metrics, and owner-managed customer password reset.

This artifact reconstructs the complete BMAD implementation history from the delivered system. It is not a forward-looking plan.

Regeneration scope: This file was regenerated as a detailed retrospective implementation artifact. Each delivered story is organized through the BMAD workflow stages `create-epics-and-stories`, `check-implementation-readiness`, `sprint-planning`, `create-story`, `dev-story`, `code-review`, `correct-course`, `investigate`, completion evidence, and final story status. The content reflects the current completed web application rather than the original early Story 1.1-only implementation view.

---

## Epic 1: Application Foundation

### Story P1-1: Express And SQLite Application Foundation

#### 1. Story Overview

Story title: Express And SQLite Application Foundation

Objective: Establish the runnable web application foundation for the single-shop membership app.

Business value: The shop needs a low-cost, locally runnable app with minimal infrastructure and no external database dependency.

#### 2. create-epics-and-stories

Original story definition: As a developer, I want a simple Express app with SQLite persistence so the owner portal can be implemented on a stable foundation.

Acceptance criteria:

- Express server starts locally.
- Static assets are served from `/public`.
- Routes, models, middleware, views, and database modules are separated.
- SQLite schema/setup exists.
- Database helper enables foreign keys.
- Test runner is available through `npm test`.

Dependencies: None.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Node.js runtime.
- npm dependencies.
- Project Context stack decision: Express, SQLite, vanilla HTML/CSS/JS.

Architectural dependencies:

- `server.js`
- `config.js`
- `database/database.js`
- `database/schema.sql`
- `database/setup.js`
- `database/migrations.js`

#### 4. sprint-planning

Implementation approach: Build a minimal Express app, wire session/static middleware, create database helper and setup scripts, then add model/route/view folders.

Scope:

- Server startup.
- Config defaults.
- SQLite schema.
- Database helper.
- Static asset serving.
- Basic shared error/404 views.

Estimated effort: 1-2 development days.

Planned files/components:

- `server.js`
- `config.js`
- `database/*`
- `routes/*`
- `models/*`
- `middleware/*`
- `views/shared/*`
- `public/css/styles.css`
- `public/js/admin.js`

#### 5. create-story

Final story specification: Implement the app foundation that all owner and customer workflows use.

Technical requirements:

- CommonJS modules.
- `express.urlencoded` and JSON parsing.
- `express-session`.
- Static asset serving.
- SQLite foreign keys enabled.
- Schema-driven setup.

UI requirements:

- Shared error page.
- Shared 404 page.
- Baseline Barista styling.

Business rules:

- No business rule mutation implemented in this story.

#### 6. dev-story

Implementation summary: The app was implemented as a single Express process with SQLite persistence and server-rendered HTML.

Files created:

- `server.js`
- `config.js`
- `database/database.js`
- `database/schema.sql`
- `database/setup.js`
- `database/migrations.js`
- `views/shared/404.html`
- `views/shared/error.html`

Files modified:

- `package.json`
- `package-lock.json`
- `public/css/styles.css`
- `public/js/admin.js`

Routes:

- `GET /` redirects to admin dashboard/login flow.

Models:

- Database helper only at this stage.

Views:

- Shared error and 404 views.

Database impact:

- Created foundational tables: `admin_users`, `customer_accounts`, `package_purchases`, `delivery_history`, `admin_action_logs`.

#### 7. code-review

Validation performed:

- Confirmed app starts.
- Confirmed folders match implementation conventions.
- Confirmed SQLite schema uses constraints and foreign keys.

Quality checks:

- Centralized database helpers.
- No duplicated database connection logic.
- Simple route/model boundaries.

Security checks:

- Session middleware configured with `httpOnly` and `sameSite`.
- Foreign keys enabled.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Initial preferred stack references to Next.js/Prisma were superseded by Project Context and delivered Express/SQLite app.

Implementation adjustments:

- Added migration helper to support incremental schema changes.

Design changes:

- Kept server-rendered HTML instead of introducing a template engine/framework.

Scope corrections:

- Foundation remained intentionally simple.

#### 9. investigate

Bugs encountered: None blocking.

Root cause analysis: Not applicable.

Debugging notes: Later browser QA identified stale running server process risk; fresh server startup became part of review guidance.

Resolution: Use current-code server for browser QA.

#### 10. Completion Evidence

Implementation proof:

- App starts with `npm run dev`.
- Tests run with `npm test`.

Route evidence:

- `server.js` wires root/admin/customer route modules.

UI evidence:

- Static assets and shared views render.

Database evidence:

- `database/schema.sql` and migrations create required tables.

Test evidence:

- Current suite: 30 passing tests.

#### 11. Story Status

Implemented.

Delivered.

### Epic 1 Summary

The app foundation was delivered as a maintainable single Express/SQLite web application.

### Epic 1 Deliverables

- Runnable app.
- SQLite setup.
- Static assets.
- Route/model/view structure.
- Test harness.

---

## Epic 2: Owner Authentication And Route Protection

### Story P1-2: Owner Login, Logout, And Admin Route Guard

#### 1. Story Overview

Story title: Owner Login, Logout, And Admin Route Guard

Objective: Protect owner-only workflows behind admin authentication.

Business value: Package purchases, deliveries, voids, password resets, and revenue metrics must not be publicly accessible.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want to log in and out so only authorized admin users can manage membership data.

Acceptance criteria:

- Admin passwords are stored as bcrypt hashes.
- Admin login validates credentials.
- Login failure is generic.
- Logout clears session.
- `/admin/*` routes require admin role.
- Customer sessions cannot access admin routes.

Dependencies: App foundation.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Session middleware.
- Admin user model.
- Password helper.

Architectural dependencies:

- `models/admin-user.js`
- `models/password.js`
- `middleware/auth.js`
- `routes/admin.js`

#### 4. sprint-planning

Implementation approach: Add bcrypt password helper, admin authentication model, admin login view/routes, logout route, and `requireAdmin` middleware.

Scope:

- Admin login/logout.
- Admin session creation.
- Admin route protection.

Estimated effort: 1 development day.

Planned files/components:

- `models/password.js`
- `models/admin-user.js`
- `middleware/auth.js`
- `views/shared/admin-login.html`
- `routes/admin.js`
- `tests/admin-auth.test.js`

#### 5. create-story

Final story specification: Implement owner/admin authentication using session role checks.

Technical requirements:

- Use bcrypt for password hashing and comparison.
- Store no raw passwords.
- Use `request.session.user`.
- Redirect unauthenticated admin access to `/admin/login?message=session-expired`.

UI requirements:

- Admin login form.
- Generic invalid login error.
- Logout action in admin sidebar.

Business rules:

- Only `admin` role can access owner/admin portal.

#### 6. dev-story

Implementation summary: Admin authentication was implemented with bcrypt and express-session.

Files created:

- `models/admin-user.js`
- `models/password.js`
- `middleware/auth.js`
- `views/shared/admin-login.html`
- `tests/admin-auth.test.js`

Files modified:

- `routes/admin.js`
- `server.js`
- `database/setup.js`

Routes:

- `GET /admin/login`
- `POST /admin/login`
- `POST /admin/logout`
- Protected `/admin/*`

Models:

- `authenticateAdmin`
- `createAdminUser`
- `findAdminByUsername`

Views:

- Admin login page.
- Admin sidebar logout form.

Database impact:

- Uses `admin_users.password_hash`.

#### 7. code-review

Validation performed:

- Hash storage verified.
- Login success/failure verified.
- Logout verified.
- Route protection verified.

Quality checks:

- Authentication logic isolated in model/middleware.
- Generic errors avoid credential disclosure.

Security checks:

- Raw passwords are not stored.
- Route protection rejects unauthenticated and wrong-role sessions.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes: None.

Implementation adjustments: Customer/admin route separation later reused the same auth middleware file.

Design changes: Sidebar logout added to admin shell.

Scope corrections: No customer auth added in Phase 1 story.

#### 9. investigate

Bugs encountered: No major auth defects.

Root cause analysis: Not applicable.

Debugging notes: Tests cover session expiry redirects.

Resolution: Not applicable.

#### 10. Completion Evidence

Implementation proof:

- `routes/admin.js`
- `middleware/auth.js`

Route evidence:

- `/admin/login`, `/admin/logout`, `/admin/dashboard`.

UI evidence:

- Admin login form and logout button.

Database evidence:

- `admin_users.password_hash`.

Test evidence:

- `tests/admin-auth.test.js`.
- `tests/customer-portal.test.js` customer session admin rejection.

#### 11. Story Status

Implemented.

Delivered.

### Epic 2 Summary

Owner authentication and admin route protection were delivered.

### Epic 2 Deliverables

- Admin login/logout.
- bcrypt password hashing.
- Protected admin route middleware.

---

## Epic 3: Customer Account Management

### Story P1-3: Create, Search, And View Customers

#### 1. Story Overview

Story title: Create, Search, And View Customers

Objective: Allow the owner to manage customer membership accounts.

Business value: The owner needs a simple operational workflow for a small member base.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want to create and find customer accounts so I can manage prepaid cup balances.

Acceptance criteria:

- Customer name, phone, login identifier, and password are required.
- Email is optional.
- Duplicate phone and login identifier are blocked.
- Customer list/search exists.
- Customer detail displays profile and current balance.

Dependencies: Admin route protection and database schema.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- `customer_accounts` table.
- Password helper.
- Admin route guard.

Architectural dependencies:

- `models/customer-account.js`
- `routes/admin.js`

#### 4. sprint-planning

Implementation approach: Build customer model methods first, then add admin forms/list/detail, then add duplicate handling and tests.

Scope:

- Create customer.
- List/search customers.
- View customer details.

Estimated effort: 1-2 development days.

Planned files/components:

- `models/customer-account.js`
- `routes/admin.js`
- Admin customer views via server-rendered route HTML.
- `tests/phase1-owner.test.js`

#### 5. create-story

Final story specification: Implement owner customer account management.

Technical requirements:

- Prepared statements.
- Unique constraints.
- bcrypt password hash on customer creation.
- Generated balance access token for later shared access.

UI requirements:

- Add customer form.
- Customer list/search.
- Customer detail profile card.

Business rules:

- Phone is required and unique.
- Login identifier is required and unique.
- Email is optional.

#### 6. dev-story

Implementation summary: Customer management was implemented in the admin portal.

Files created:

- `models/customer-account.js`

Files modified:

- `routes/admin.js`
- `database/schema.sql`
- `tests/phase1-owner.test.js`

Routes:

- `GET /admin/customers`
- `GET /admin/customers/new`
- `POST /admin/customers`
- `GET /admin/customers/:customerId`

Models:

- `createCustomerAccount`
- `findCustomerById`
- `findCustomerByLoginIdentifier`
- `searchCustomers`
- `findCustomerByPhone`

Views:

- Admin customer list/search.
- Admin add customer form.
- Admin customer detail.

Database impact:

- Uses `customer_accounts`.
- Enforces unique phone and login identifier.

#### 7. code-review

Validation performed:

- Duplicate phone and login checks.
- Search behavior.
- Protected route behavior.

Quality checks:

- Customer model centralizes database operations.
- Server handles duplicate errors with non-technical messages.

Security checks:

- Customer passwords hashed.
- Customer detail is admin-only.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Phone became required.
- Email remained optional.

Implementation adjustments:

- Added `balance_access_token` at creation to support later shared access.

Design changes:

- Customer detail became the operational hub for package purchase, delivery, access link, password reset, and histories.

Scope corrections:

- Customer self-service remained outside Phase 1.

#### 9. investigate

Bugs encountered: Duplicate handling needed clear server-side messages.

Root cause analysis: SQLite unique constraints alone would produce technical errors.

Debugging notes: Model checks duplicates before insert and database constraints remain as safety net.

Resolution: Added explicit duplicate error codes.

#### 10. Completion Evidence

Implementation proof:

- Customer routes and model functions implemented.

Route evidence:

- `/admin/customers`, `/admin/customers/new`, `/admin/customers/:customerId`.

UI evidence:

- Customer list/search and customer detail page.

Database evidence:

- `customer_accounts` records with hashed password, token, and balance.

Test evidence:

- `tests/phase1-owner.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Story P1-4: Owner-Managed Customer Password Reset

#### 1. Story Overview

Story title: Owner-Managed Customer Password Reset

Objective: Let the owner reset a forgotten customer password from the admin portal.

Business value: Small-shop owner support avoids building email/SMS reset infrastructure.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want to set a new temporary password for a customer so they can regain access.

Acceptance criteria:

- Admin-only reset action on customer detail.
- Owner can set temporary password.
- New password is hashed using existing helper.
- Raw password is never stored.
- Old password no longer works.
- New password works.
- Customer cannot reset password themselves.
- No email, SMS, or automated forgot-password flow.

Dependencies: Customer account model, admin auth, customer auth.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Customer account password hash field.
- Existing password helper.
- Admin route guard.
- Customer login tests.

Architectural dependencies:

- `models/customer-account.js`
- `models/password.js`
- `routes/admin.js`
- `routes/customer.js`

#### 4. sprint-planning

Implementation approach: Add model method to update password hash, add admin-only route, add customer detail form, test old/new login.

Scope:

- Admin reset form.
- Admin POST route.
- Password hash update.
- Regression tests.

Estimated effort: 0.5 development day.

Planned files/components:

- `models/customer-account.js`
- `routes/admin.js`
- `tests/customer-portal.test.js`

#### 5. create-story

Final story specification: Implement owner-managed password reset without adding customer self-service reset.

Technical requirements:

- Use `hashPassword`.
- Validate non-empty new password.
- Update `updated_at`.
- Return 404 for missing customer.
- Require admin and CSRF.

UI requirements:

- Text: “Reset customer password”.
- Text: “Share this temporary password with the customer securely.”
- Temporary password input.

Business rules:

- Customer cannot initiate reset.
- No raw password storage.

#### 6. dev-story

Implementation summary: Added reset form and admin-only route backed by a hash update model function.

Files created: None.

Files modified:

- `models/customer-account.js`
- `routes/admin.js`
- `tests/customer-portal.test.js`

Routes:

- `POST /admin/customers/:customerId/password-reset`

Models:

- `resetCustomerPassword`

Views:

- Customer detail reset card.

Database impact:

- Updates `customer_accounts.password_hash`.
- Updates `customer_accounts.updated_at`.
- No schema change.

#### 7. code-review

Validation performed:

- Old password rejected after reset.
- New password accepted.
- Stored value starts with bcrypt hash marker and does not equal raw password.
- Non-admin reset attempts rejected.

Quality checks:

- Reused existing password helper.
- Kept logic in customer account model.

Security checks:

- Admin-only route.
- CSRF enforced.
- No self-service route.
- Raw password not stored.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Added after customer portal existed, but implemented as owner/admin management behavior.

Implementation adjustments:

- Test coverage added in customer portal test file because login behavior is the observable outcome.

Design changes:

- Added compact account access card on customer detail.

Scope corrections:

- Explicitly avoided forgot-password, email, SMS, and customer reset UI.

#### 9. investigate

Bugs encountered: None after implementation.

Root cause analysis: Not applicable.

Debugging notes: Tests verify old password no longer creates session.

Resolution: Not applicable.

#### 10. Completion Evidence

Implementation proof:

- `resetCustomerPassword()` exists and is exported.

Route evidence:

- `POST /admin/customers/:customerId/password-reset`.

UI evidence:

- Customer detail page contains reset form and secure-sharing guidance.

Database evidence:

- `password_hash` updated; raw password absent.

Test evidence:

- `tests/customer-portal.test.js` password reset tests.

#### 11. Story Status

Implemented.

Delivered.

### Epic 3 Summary

Customer management was delivered as an admin-only workflow with creation, lookup, detail, duplicate prevention, and owner-managed password recovery.

### Epic 3 Deliverables

- Customer model.
- Admin customer routes.
- Customer detail operational hub.
- Password reset action.
- Tests.

---

## Epic 4: Package Purchase And Balance Credits

### Story P1-5: Fixed VND Package Purchase Recording

#### 1. Story Overview

Story title: Fixed VND Package Purchase Recording

Objective: Record prepaid packages and increase customer balance by credited cups.

Business value: The app records operational revenue and balances while payment remains outside the system.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want to record package purchases so customers receive the right prepaid cups.

Acceptance criteria:

- Package sizes: 10, 20, 30 only.
- Price: `30.000 ₫` per purchased cup.
- Amount calculated automatically.
- Amount stored as `amount_paid_cents`.
- Manual amount entry removed.
- Balance update is transactional.

Dependencies: Customer detail and package credit rules.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Customer accounts.
- Package purchase table.
- Cup-balance rules.

Architectural dependencies:

- `models/package-purchase.js`
- `models/cup-balance.js`
- `models/currency.js`

#### 4. sprint-planning

Implementation approach: Centralize amount calculation in model, use select input in UI, update balance in one transaction.

Scope:

- Package model.
- Customer detail package form.
- Purchase history.
- VND formatting.

Estimated effort: 1 development day.

Planned files/components:

- `models/package-purchase.js`
- `models/currency.js`
- `routes/admin.js`
- `public/js/admin.js`
- Tests.

#### 5. create-story

Final story specification: Implement fixed-price package purchase workflow.

Technical requirements:

- Server-side amount calculation.
- SQLite transaction for insert and balance update.
- Prepared statements.

UI requirements:

- Purchased cups selector.
- Calculated amount display.
- Bonus note.
- Total credited display.

Business rules:

- `amount_paid_cents = packageSize * 30000 * 100`.

#### 6. dev-story

Implementation summary: Package purchases update balance and record calculated VND amount.

Files created:

- `models/package-purchase.js`
- `models/currency.js`

Files modified:

- `routes/admin.js`
- `public/js/admin.js`
- `tests/phase1-owner.test.js`
- `tests/currency.test.js`

Routes:

- `POST /admin/customers/:customerId/package-purchases`
- `GET /admin/customers/:customerId/package-purchases`

Models:

- `recordPackagePurchase`
- `calculatePackageAmountPaidCents`
- `formatVndFromCents`

Views:

- Customer detail package card.
- Package purchase history.

Database impact:

- Inserts into `package_purchases`.
- Updates `customer_accounts.current_balance`.

#### 7. code-review

Validation performed:

- Amounts for 10/20/30 verified.
- Manual amount input absent.
- Balance totals verified.

Quality checks:

- Pricing rule centralized.
- UI preview mirrors model constants.

Security checks:

- Admin-only package route.
- CSRF enforced.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Manual amount entry replaced by fixed cup pricing.
- 30-cup package bonus changed to `30 -> 33`.

Implementation adjustments:

- Updated package calculation tests.
- Updated dashboard revenue expectations.

Design changes:

- Preview box added for calculated amount and credited cups.

Scope corrections:

- Payment processing stayed out of scope.

#### 9. investigate

Bugs encountered: Earlier documentation/test assumptions used USD/manual amount.

Root cause analysis: Initial artifacts predated fixed VND pricing decision.

Debugging notes: Reconciled tests and docs to `amount_paid_cents`.

Resolution: Fixed tests/docs and centralized pricing.

#### 10. Completion Evidence

Implementation proof:

- Package purchase model and admin route implemented.

Route evidence:

- `POST /admin/customers/:customerId/package-purchases`.

UI evidence:

- Customer detail package selector and preview.

Database evidence:

- `package_purchases.amount_paid_cents`.

Test evidence:

- `tests/phase1-owner.test.js`.
- `tests/currency.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Story P1-6: Bonus Cup Rule Enforcement

#### 1. Story Overview

Story title: Bonus Cup Rule Enforcement

Objective: Apply fixed bonus cup rules consistently.

Business value: Owner does not manually calculate package credits.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want package credits calculated automatically so balances remain accurate.

Acceptance criteria:

- 10 purchased cups credits 11.
- 20 purchased cups credits 22.
- 30 purchased cups credits 33.
- Invalid package size rejected.

Dependencies: Package workflow.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Package-size decision.
- Central model function.

Architectural dependencies:

- `models/cup-balance.js`

#### 4. sprint-planning

Implementation approach: Keep rule map in a single function and reuse from package purchase model.

Scope:

- Package credit calculation.
- Tests.
- UI preview update.

Estimated effort: 0.5 development day.

Planned files/components:

- `models/cup-balance.js`
- `public/js/admin.js`
- `tests/customer-balance.test.js`

#### 5. create-story

Final story specification: Implement and test fixed bonus rules.

Technical requirements:

- Throw meaningful error for invalid size.
- Return package size, bonus cups, total cups added.

UI requirements:

- Preview shows bonus note and total credited.

Business rules:

- `10 -> 11`, `20 -> 22`, `30 -> 33`.

#### 6. dev-story

Implementation summary: Bonus rules are centralized and covered by tests.

Files created:

- `models/cup-balance.js`
- `tests/customer-balance.test.js`

Files modified:

- `models/package-purchase.js`
- `public/js/admin.js`

Routes:

- Used by package purchase route.

Models:

- `calculatePackageCredits`.

Views:

- Package preview on customer detail.

Database impact:

- Stores `bonus_cups` and `total_cups_added`.

#### 7. code-review

Validation performed:

- All package sizes tested.
- Invalid package size tested.

Quality checks:

- No duplicate server-side bonus logic.

Security checks:

- Invalid client-submitted package sizes rejected server-side.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- 30-cup package was corrected from no bonus to +3 bonus.

Implementation adjustments:

- Updated tests and documentation.

Design changes:

- UI preview updated to show 33 total credited for 30.

Scope corrections:

- No arbitrary promotions added.

#### 9. investigate

Bugs encountered: Stale documentation referenced `30 -> 30`.

Root cause analysis: Earlier planning decision changed after implementation.

Debugging notes: Used `rg` scans to find stale statements.

Resolution: Reconciled docs/tests/code.

#### 10. Completion Evidence

Implementation proof:

- `models/cup-balance.js`.

Route evidence:

- Package route invokes package purchase model.

UI evidence:

- Preview in `public/js/admin.js`.

Database evidence:

- Package rows store calculated bonus/total.

Test evidence:

- `tests/customer-balance.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Epic 4 Summary

Package purchase recording and bonus calculation were delivered with fixed VND pricing and transactional balance updates.

### Epic 4 Deliverables

- Package purchase model.
- Fixed pricing calculation.
- Bonus rule model.
- Owner package form and history.
- Tests.

---

## Epic 5: Delivery Recording And Correction

### Story P1-7: Multi-Cup Delivery Recording

#### 1. Story Overview

Story title: Multi-Cup Delivery Recording

Objective: Record cup usage in positive integer quantities.

Business value: Owner can handle multiple cups in one visit.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want to record delivered cups so customer balances reflect actual usage.

Acceptance criteria:

- Quantity defaults to 1.
- Quantity must be positive integer.
- Quantity cannot exceed balance.
- Balance decreases by quantity.
- History row records delivered cups and balance after.

Dependencies: Customer balance and delivery table.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Customer detail.
- Package purchases to create balance.
- Delivery model.

Architectural dependencies:

- `models/delivery-history.js`
- `routes/admin.js`

#### 4. sprint-planning

Implementation approach: Add delivery model with transaction and validation, expose admin form on customer detail.

Scope:

- Record delivery.
- Validate quantity.
- Show delivery history.

Estimated effort: 1 development day.

Planned files/components:

- `models/delivery-history.js`
- `routes/admin.js`
- Tests.

#### 5. create-story

Final story specification: Implement safe multi-cup delivery.

Technical requirements:

- Normalize quantity.
- Transactionally update balance and insert delivery.
- Prevent negative balances.

UI requirements:

- Quantity input.
- Optional note input.
- Disabled action at zero balance.

Business rules:

- Positive integer quantity only.
- Cannot exceed current balance.

#### 6. dev-story

Implementation summary: Multi-cup delivery recording was implemented with transaction and validation.

Files created:

- `models/delivery-history.js`

Files modified:

- `routes/admin.js`
- `tests/phase1-owner.test.js`

Routes:

- `POST /admin/customers/:customerId/deliveries`
- `GET /admin/customers/:customerId/deliveries`

Models:

- `recordDelivery`
- `normalizeDeliveredCups`
- `listDeliveriesForCustomer`

Views:

- Customer detail delivery form.
- Delivery history list.

Database impact:

- Inserts `delivery_history`.
- Updates `customer_accounts.current_balance`.

#### 7. code-review

Validation performed:

- Quantity 1.
- Quantity greater than 1.
- Zero balance.
- Insufficient balance.

Quality checks:

- Validation centralized in model.
- Transaction protects balance.

Security checks:

- Admin-only route.
- CSRF required.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Expanded from one-cup delivery to multi-cup delivery.

Implementation adjustments:

- Schema check changed to `delivered_cups > 0`.

Design changes:

- Delivery form includes quantity input.

Scope corrections:

- Customer cannot record deliveries.

#### 9. investigate

Bugs encountered: Stale docs/tests referenced one-cup-only behavior.

Root cause analysis: Delivery requirements changed after initial story generation.

Debugging notes: Tests were updated to cover multiple quantities.

Resolution: Multi-cup behavior made source of truth.

#### 10. Completion Evidence

Implementation proof:

- `recordDelivery()` implemented.

Route evidence:

- `POST /admin/customers/:customerId/deliveries`.

UI evidence:

- Delivery quantity input on customer detail.

Database evidence:

- `delivery_history.delivered_cups`.

Test evidence:

- `tests/phase1-owner.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Story P1-8: Void/Cancel Mistaken Delivery

#### 1. Story Overview

Story title: Void/Cancel Mistaken Delivery

Objective: Correct mistaken deliveries without deleting history.

Business value: Owner can repair balance mistakes while preserving accountability.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want to void mistaken delivery records so balances can be restored.

Acceptance criteria:

- Void restores delivered cups.
- Delivery row remains.
- Voided row is labelled.
- Double void blocked.
- Dashboard delivered totals exclude voided rows.

Dependencies: Delivery recording.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Delivery rows with delivered cup quantity.
- Current balance updates.

Architectural dependencies:

- `models/delivery-history.js`
- `models/dashboard.js`

#### 4. sprint-planning

Implementation approach: Add void fields to delivery history and owner-only void route.

Scope:

- Void route.
- Balance restoration.
- Voided labels.
- Dashboard exclusion.

Estimated effort: 1 development day.

Planned files/components:

- `models/delivery-history.js`
- `models/dashboard.js`
- `routes/admin.js`
- Tests.

#### 5. create-story

Final story specification: Implement delivery voiding as reversible correction.

Technical requirements:

- Transactionally restore balance and mark row voided.
- Store `voided_at` and `voided_by_admin_id`.
- Reject already voided rows.

UI requirements:

- “Void delivery” action for non-voided delivery.
- Voided label.

Business rules:

- Voided deliveries do not count as delivered cups in dashboard totals.

#### 6. dev-story

Implementation summary: Delivery voiding was implemented with balance restoration and retained history.

Files created: None.

Files modified:

- `models/delivery-history.js`
- `models/dashboard.js`
- `routes/admin.js`
- `database/schema.sql`
- Tests.

Routes:

- `POST /admin/deliveries/:deliveryId/void`

Models:

- `voidDelivery`
- `findDeliveryById`
- Dashboard delivered-cups query.

Views:

- Delivery history void action and labels.

Database impact:

- Uses `voided_at`.
- Uses `voided_by_admin_id`.

#### 7. code-review

Validation performed:

- Balance restoration tested.
- Double void tested.
- Dashboard exclusion tested.

Quality checks:

- No deletion of delivery rows.
- Clear error code for already voided rows.

Security checks:

- Admin-only route and CSRF.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Reversible correction was added after multi-cup delivery.

Implementation adjustments:

- Dashboard query excludes voided deliveries.

Design changes:

- History labels voided rows.

Scope corrections:

- Customer pages remain read-only and cannot void deliveries.

#### 9. investigate

Bugs encountered: None blocking.

Root cause analysis: Not applicable.

Debugging notes: Double-void behavior was tested to avoid duplicate balance restoration.

Resolution: Guarded `voided_at IS NULL`.

#### 10. Completion Evidence

Implementation proof:

- `voidDelivery()` model function.

Route evidence:

- `POST /admin/deliveries/:deliveryId/void`.

UI evidence:

- Void action and void label.

Database evidence:

- `voided_at`, `voided_by_admin_id`.

Test evidence:

- `tests/phase1-owner.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Epic 5 Summary

Delivery recording and correction were delivered with safe transactional balance handling.

### Epic 5 Deliverables

- Multi-cup delivery model.
- Delivery history.
- Void/cancel correction.
- Dashboard exclusion.
- Tests.

---

## Epic 6: Dashboard, Histories, And Owner UI

### Story P1-9: Dashboard Metrics And Owner History Usability

#### 1. Story Overview

Story title: Dashboard Metrics And Owner History Usability

Objective: Give the owner useful operational visibility and compact history views.

Business value: Owner can understand membership status quickly during shop operations.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want dashboard metrics and readable histories so I can monitor the prepaid cup program.

Acceptance criteria:

- Dashboard shows total customers.
- Dashboard shows outstanding cups.
- Dashboard shows recorded package revenue.
- Dashboard shows delivered cups.
- Dashboard shows bonus cups.
- Dashboard shows low-balance customers.
- Dashboard shows recent deliveries.
- History previews show 5 recent records.
- Full histories are available through `View All`.
- Admin deliveries are paginated newest first.

Dependencies: Customer, package, and delivery data.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Customer model.
- Package purchase model.
- Delivery history model.

Architectural dependencies:

- `models/dashboard.js`
- `routes/admin.js`
- `public/css/styles.css`

#### 4. sprint-planning

Implementation approach: Add dashboard metric queries, render owner dashboard cards, then add history preview limits and full-history routes.

Scope:

- Dashboard.
- Recent history previews.
- Full history pages.
- Admin deliveries pagination.

Estimated effort: 1-2 development days.

Planned files/components:

- `models/dashboard.js`
- `routes/admin.js`
- `views/admin/dashboard.html`
- `tests/phase1-owner.test.js`
- Browser QA screenshots.

#### 5. create-story

Final story specification: Implement owner reporting and history usability for the MVP.

Technical requirements:

- Dashboard metrics queries.
- Recent delivery limit.
- Paginated admin deliveries.
- No change to balance logic.

UI requirements:

- Metric cards.
- Low-balance table.
- Recent deliveries list.
- Compact pagination.

Business rules:

- Delivered cups exclude voided deliveries.
- Histories newest first.

#### 6. dev-story

Implementation summary: Dashboard and histories were implemented and browser-polished.

Files created:

- `models/dashboard.js`

Files modified:

- `routes/admin.js`
- `views/admin/dashboard.html`
- `public/css/styles.css`
- `tests/phase1-owner.test.js`

Routes:

- `GET /admin/dashboard`
- `GET /admin/customers/:customerId/package-purchases`
- `GET /admin/customers/:customerId/deliveries`
- `GET /admin/deliveries`

Models:

- `getDashboardMetrics`
- Package/delivery list functions.

Views:

- Dashboard.
- Customer detail histories.
- Full history pages.

Database impact:

- Read-only metric queries.

#### 7. code-review

Validation performed:

- Dashboard metrics tested.
- Recent delivery limit tested.
- Pagination tested.
- Browser QA tested desktop/mobile layout.

Quality checks:

- Metric query centralization.
- UI pagination separated from route logic.

Security checks:

- Dashboard and histories admin-only.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- History lists changed from unlimited to recent preview plus View All.

Implementation adjustments:

- Added admin delivery pagination.

Design changes:

- Fixed pagination layout so buttons do not stretch.
- Fixed mobile overflow for admin table pages.

Scope corrections:

- Advanced reporting deferred.

#### 9. investigate

Bugs encountered:

- Newer/Older pagination alignment issue.
- Mobile horizontal overflow on admin pages.

Root cause analysis:

- Pagination grid used flexible columns.
- Table/card containers needed `min-width: 0` and constrained overflow.

Debugging notes:

- Browser QA measured scroll width and button widths.

Resolution:

- CSS-only fixes in `public/css/styles.css`.

#### 10. Completion Evidence

Implementation proof:

- Dashboard metrics model and routes.

Route evidence:

- `/admin/dashboard`, `/admin/deliveries?page=1`, `/admin/deliveries?page=2`.

UI evidence:

- Browser QA screenshots.

Database evidence:

- Read-only aggregate queries over customers, packages, deliveries.

Test evidence:

- `tests/phase1-owner.test.js`.
- Browser QA screenshots and metrics.

#### 11. Story Status

Implemented.

Delivered.

### Epic 6 Summary

Owner dashboard and history usability were delivered and browser-verified.

### Epic 6 Deliverables

- Dashboard metrics.
- Recent history previews.
- Full history pages.
- Paginated delivery history.
- Browser layout fixes.

---

## Phase Retrospective

Phase 1 was implemented iteratively beyond the original scaffold story. The final phase includes full owner/admin operation of the membership program and owner-managed support workflows.

## Lessons Learned

- Retrospective BMAD artifacts are necessary when implementation evolves faster than planning docs.
- Centralized models make later changes safer.
- Browser QA catches layout issues not visible in Supertest.

## Scope Changes

- Fixed VND pricing replaced manual amount entry.
- Multi-cup delivery replaced one-cup-only assumptions.
- Delivery voiding was added.
- History preview + View All was added.
- Owner-managed customer password reset was added.

## Final Delivered Outcome

Phase 1 Owner MVP is complete and delivered.
