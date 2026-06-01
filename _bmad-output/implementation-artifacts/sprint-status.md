# Sprint Status: Phase 1 Owner MVP

Date: 2026-06-01
Project: barista-coffee-membership
Status: Planned

## 1. Sprint Planning Scope

This sprint plan covers Phase 1 Owner MVP only.

Source artifacts:

- Project Context: `_bmad-output/project-context.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Phase 1 Epics & Stories: `_bmad-output/planning-artifacts/phase-1-owner-mvp-epics-and-stories.md`

Out of scope for this sprint plan:

- Customer login.
- Customer self-service portal.
- Advanced reporting.
- Audit logs.
- CSRF hardening.
- Production deployment readiness.

## 2. Phase 1 Delivery Goal

Allow the coffee shop owner to operate the membership program end-to-end without customer-facing functionality:

- Log in as admin.
- Create and find customers.
- Record package purchases.
- Apply bonus cup rules: `10 -> 11`, `20 -> 22`, `30 -> 30`.
- Track balances.
- Record deliveries.
- View delivery history.
- See basic owner dashboard metrics.

## 3. Readiness Notes Applied

The readiness review found Phase 1 is implementable with concerns. Sprint execution should account for these adjustments:

- Tighten schema acceptance criteria before Story 1.3 implementation.
- Defer customer-facing route/view scaffolding in Story 1.1.
- Treat customer password fields in Phase 1 as stored credentials for later customer self-service, not active customer login.
- Implement dashboard metric queries before rendering the dashboard.
- Track CSRF as deferred to a later security/readiness phase.

## 4. Sprint 1: Owner MVP Foundation

### Sprint Goal

Create the runnable app foundation, local database setup, package credit business logic, and initial test harness. By the end of Sprint 1, Amelia can run the app locally and verify core package credit rules with tests.

### Estimated Effort

3-4 development days.

### Included Stories

| Order | Story | Status | Notes |
|---|---|---|---|
| 1 | Story 1.1: Scaffold Express Application | Done | Owner-only Express scaffold created and verified. |
| 2 | Story 1.2: Add Environment Configuration | Done | `.env.example` added; app reads config from environment/defaults. |
| 3 | Story 1.5: Implement Package Credit Calculation | Done | Package credit rules implemented in `/models/cup-balance.js`. |
| 4 | Story 1.6: Add Foundation Tests | Done | Node test runner covers package credit rules and invalid package size. |
| 5 | Story 1.3: Create SQLite Schema And Setup Script | Done | Schema includes architecture-aligned Phase 1 constraints. |
| 6 | Story 1.4: Add Database Connection Helper | Done | SQLite helper opens database and enables foreign keys. |

### Sprint 1 Expected Deliverable

- Express app starts locally.
- Approved Phase 1 folder structure exists.
- `.env.example` exists.
- SQLite schema/setup script exists.
- Database helper opens SQLite with foreign keys enabled.
- Package credit calculation works for `10`, `20`, and `30`.
- Foundation tests pass with `npm test`.

### Sprint 1 Definition Of Done

- `npm run dev` starts the app.
- `npm test` runs successfully.
- No customer-facing login, routes, or portal pages are implemented.
- No raw database errors are exposed from implemented paths.
- Package credit logic is centralized in `/models/cup-balance.js`.
- SQLite schema includes constraints for Phase 1 data integrity:
  - unique admin username
  - unique customer phone
  - unique customer login identifier
  - non-negative `current_balance`
  - package size limited to `10`, `20`, `30`
  - non-negative `amount_paid_cents`
  - delivery rows limited to `delivered_cups = 1`
  - non-negative `balance_after`

## 5. Later Phase 1 Sprint Backlog

These stories remain in Phase 1 but are not part of Sprint 1.

### Sprint 2 Candidate: Owner Authentication And Customer Management

Goal: owner can log in and manage customer accounts.

Stories:

- Story 2.1: Add Password Hashing Utilities.
- Story 2.2: Seed Or Create Initial Admin User.
- Story 2.3: Implement Admin Login And Logout.
- Story 2.4: Protect Admin Routes.
- Story 2.5: Add Owner Auth Tests.
- Story 3.1: Create Customer Account Model.
- Story 3.2: Build Add Customer Form.
- Story 3.3: Prevent Duplicate Customer Accounts.
- Story 3.4: Build Customer List And Search.
- Story 3.5: Build Customer Detail Page.
- Story 3.6: Add Customer Management Tests.

Expected deliverable:

- Owner can log in, create customers, prevent duplicates, list/search customers, and open customer detail pages.

### Sprint 3 Candidate: Package Purchases And Balance Credits

Goal: owner can record package purchases and update customer balances.

Stories:

- Story 4.1: Create Package Purchase Model.
- Story 4.2: Build Record Package Purchase Form.
- Story 4.3: Show Bonus Cup Calculation Before Save.
- Story 4.4: Update Customer Balance Transactionally.
- Story 4.5: Display Package Purchase History.
- Story 4.6: Add Package Purchase Tests.

Expected deliverable:

- Owner can record 10, 20, and 30 cup packages; balances update correctly; package history is visible.

### Sprint 4 Candidate: Delivery Recording And Owner Dashboard

Goal: owner can record usage and monitor the program.

Stories:

- Story 5.1: Create Delivery History Model.
- Story 5.2: Build Record Delivery Action.
- Story 5.3: Prevent Zero-Balance Delivery.
- Story 5.4: Display Admin Delivery History.
- Story 5.5: Add Delivery Tests.
- Story 6.2: Add Dashboard Metric Queries.
- Story 6.1: Build Basic Owner Dashboard.
- Story 6.3: Add Basic Dashboard Tests.

Expected deliverable:

- Owner can record deliveries, see delivery history, prevent zero-balance delivery, and view basic owner dashboard metrics.

## 6. Sprint 1 Risks

- Schema scope could drift toward future phases if customer routes/views are scaffolded too early.
- Missing SQLite constraints would allow balance or package data corruption.
- If tests are delayed, package credit logic may be duplicated in UI and model code.

## 7. Next Story To Create

Next implementation story:

- Story 1.1: Scaffold Express Application

Reason:

- It has no dependencies.
- It unblocks environment setup, database setup, and test harness work.
- Readiness review confirmed Amelia can begin Story 1.1 immediately.

## 8. Epic 1 Completion Notes

Status: Ready for Review

Completed stories:

- Story 1.1: Scaffold Express Application.
- Story 1.2: Add Environment Configuration.
- Story 1.3: Create SQLite Schema And Setup Script.
- Story 1.4: Add Database Connection Helper.
- Story 1.5: Implement Package Credit Calculation.
- Story 1.6: Add Foundation Tests.

Verification:

- `npm install`
- `npm run db:setup`
- `npm test`
- `node --check server.js`
- `node --check config.js`
- `node --check database/database.js`
- `node --check database/setup.js`
- `node --check models/cup-balance.js`
- `node --check tests/customer-balance.test.js`
- `npm run dev`
- `GET /admin/dashboard` returned `200`
- `GET /` returned redirect to `/admin/dashboard`
