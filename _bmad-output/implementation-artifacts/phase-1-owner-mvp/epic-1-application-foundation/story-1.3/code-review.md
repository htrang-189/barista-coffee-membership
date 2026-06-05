# Story 1.3: Create SQLite Schema And Setup Script

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: Approve

Workflow context: BMAD code-review output

Status: Reviewed

## Review Scope

This code review evaluates the implemented Story 1.3: Create SQLite Schema And Setup Script. The review uses the completed application as the source of truth and focuses on the delivered database schema, setup script, migration support, and related integration points.

Reviewed implementation areas:

- `database/schema.sql`
- `database/setup.js`
- `database/migrations.js`
- `database/database.js`
- `models/admin-user.js`
- `models/customer-account.js` migration integration
- `package.json` database setup script
- Automated tests that exercise schema-backed workflows

The purpose of the story was to create the local SQLite persistence foundation for the Owner MVP. The implemented story is reviewed for architecture compliance, coding standards, security, validation, database integrity, error handling, UI consistency, and test coverage.

## Architecture Compliance

The implementation complies with the approved application architecture.

The application is a single Express web app backed by SQLite. Story 1.3 correctly implements a SQLite schema and setup script instead of introducing external database infrastructure. This matches the product requirement for low maintenance, low hosting cost, and local runnability.

The schema is placed in `database/schema.sql`, setup logic is placed in `database/setup.js`, migration behavior is placed in `database/migrations.js`, and database connection behavior remains in `database/database.js`. This separation is architecturally sound. Schema definition, setup execution, migration logic, and runtime database access are distinct responsibilities.

The schema supports the delivered app without adding non-MVP product concepts. It includes admins, customers, package purchases, delivery history, and admin action logs. It does not add payment-processing tables, POS integration tables, loyalty reward tables, ordering tables, or multi-shop tenancy tables. That is consistent with the Owner MVP scope.

Finding: Architecture compliance is strong. The schema/setup implementation is correctly scoped and aligned with the current delivered app.

## Coding Standards

The implementation follows the project's CommonJS and simple Node.js style.

`database/setup.js` uses standard Node filesystem and path utilities, imports `config.js`, opens the database through the shared helper, runs migrations, and delegates admin creation to the admin user model. This keeps setup readable and avoids duplicating admin credential logic inside setup code.

`database/migrations.js` is organized into focused helper functions. It wraps database operations in promises, checks for column existence, ensures balance access token support, and rebuilds delivery history when needed to support multi-cup quantities and void metadata.

`database/schema.sql` is readable and explicit. Tables, constraints, foreign keys, and indexes are defined in one schema file. This is suitable for a small SQLite-backed MVP.

Finding: Coding standards are met. The implementation is clear, maintainable, and consistent with the rest of the app.

## Security Review

The schema and setup support the security needs of the MVP.

Admin and customer tables store `password_hash` fields rather than raw passwords. The setup script uses `createAdminUser()` from `models/admin-user.js`, which hashes the admin password before insertion. This is the correct security boundary for initial admin setup.

Customer balance access tokens are stored with a uniqueness requirement. This matters because shared balance links are bearer-style access links. A token collision would create a customer data exposure risk. The schema and migration support unique token behavior.

Foreign key relationships help ensure package purchases and deliveries are tied to valid customer and admin records. This supports data integrity and reduces the risk of orphaned operational records.

The setup script prints the development admin password only when `ADMIN_PASSWORD` is not provided. That behavior is acceptable for local development, but non-local setup must use explicit admin credentials.

Finding: Security is acceptable for the MVP foundation. Production setup should continue to require explicit admin password and session-secret values.

## Validation Review

The schema includes meaningful validation through SQLite constraints.

Validation rules include:

- Unique admin usernames.
- Unique customer phone numbers.
- Unique customer login identifiers.
- Unique customer balance access tokens.
- Non-negative customer balances.
- Package size limited to `10`, `20`, or `30`.
- Non-negative package bonus cups.
- Positive total cups added.
- Non-negative `amount_paid_cents`.
- Positive delivered cup quantities.
- Non-negative `balance_after` values.

These constraints are appropriate because the app is a prepaid cup ledger. Invalid values would undermine trust in balances, purchase history, and delivery records.

Finding: Validation is strong for the MVP. The database protects key ledger invariants even before route/model validation runs.

## Database Integrity Review

Database integrity is the strongest part of this story.

The schema defines relational tables with foreign keys between package purchases, delivery records, customers, and admins. `database/database.js` enables `PRAGMA foreign_keys = ON`, which is necessary for SQLite foreign key enforcement.

The schema stores monetary package values in `amount_paid_cents`, which is consistent with the delivered fixed VND pricing workflow. Storing amounts as integer cents avoids floating-point currency issues.

Delivery records are retained and support void metadata. This is important because mistaken deliveries should be corrected without deleting history. The schema supports `voided_at` and `voided_by_admin_id`.

Indexes support common lookup and history access patterns: customer phone, login identifier, current balance, package history, delivery history, and admin action logs.

Finding: Database integrity is approved. The schema supports the delivered owner and customer workflows and preserves ledger reliability.

## Error Handling Review

`database/setup.js` handles schema execution errors by logging the failure, closing the database, and setting `process.exitCode = 1`. This is appropriate for a setup script because setup failure should be visible and should not silently continue.

Setup catches admin seeding errors, logs the failure, sets the exit code, and closes the database in a `finally` block. This is appropriate resource handling.

`database/migrations.js` uses transactions during delivery history rebuild. It rolls back on failure and restores foreign key behavior in a `finally` block. This is important because table rebuilds are higher-risk migration operations.

Finding: Error handling is acceptable and appropriately pragmatic for the MVP. Migration transactions are a strong implementation choice.

## UI Consistency Review

Story 1.3 has no direct UI output.

No owner-facing page, customer-facing page, dashboard component, form, notification, QR component, or navigation element was introduced by this story. That is correct. The story is database foundation work.

The schema indirectly supports UI consistency because later pages can read structured data for customers, package history, delivery history, balances, and dashboards. However, this story correctly avoids mixing UI work into schema/setup implementation.

Finding: UI consistency is maintained. No unnecessary UI was introduced.

## Test Coverage Review

Story 1.3 is covered heavily through the completed application's automated tests.

The current tests exercise schema-backed behavior across:

- Admin authentication.
- Customer creation and duplicate prevention.
- Package purchase creation.
- Fixed VND pricing and `amount_paid_cents`.
- Bonus cup calculations.
- Balance updates.
- Multi-cup delivery recording.
- Blocking delivery quantities greater than balance.
- Delivery voiding and balance restoration.
- Dashboard metrics.
- Customer login and balance page.
- Customer package and delivery history.
- Shared QR/token balance access.
- Owner-managed customer password reset.

Relevant test files include:

- `tests/admin-auth.test.js`
- `tests/phase1-owner.test.js`
- `tests/customer-portal.test.js`
- `tests/e2e-owner-customer-flow.test.js`

There is no single isolated schema-only test file, but the integration and workflow tests provide strong evidence that the schema and setup support the delivered application. A future hardening pass could add direct constraint tests for schema edge cases, but this is not required for approval.

Finding: Test coverage is acceptable and broad. Direct schema constraint tests are recommended as optional future coverage.

## Findings

1. `database/schema.sql` defines the core MVP tables.
2. The schema includes meaningful constraints for ledger integrity.
3. The schema includes indexes for common query patterns.
4. `database/setup.js` provides repeatable local database initialization.
5. `database/setup.js` uses the configured database path.
6. `database/setup.js` seeds or confirms the initial admin user.
7. `database/migrations.js` supports later schema evolution.
8. Migration logic supports balance access tokens and delivery void metadata.
9. `database/database.js` enables SQLite foreign keys.
10. No unnecessary UI or route behavior was added by the database story.

## Issues

No critical issues found.

No high-priority issues found.

Medium issue: There is no dedicated schema-only automated test file that directly asserts every table constraint.

Low issue: Setup prints a development admin password when no `ADMIN_PASSWORD` is provided. This is useful locally but must remain clearly development-only.

Low issue: SQLite remains appropriate for the MVP, but production use should include a backup plan.

## Recommendations

1. Add direct schema constraint tests in a future hardening pass if the app moves toward production use.
2. Keep setup documentation explicit that `ADMIN_PASSWORD` should be provided outside local development.
3. Maintain SQLite backup guidance if the shop uses the app with real operational data.
4. Continue using migrations for future schema changes instead of manual database edits.
5. Keep business logic in model modules and avoid moving balance calculations into schema/setup code.

## Approval Decision

The implemented Story 1.3 meets the expectations for the Owner MVP database foundation. The schema is appropriately scoped, data integrity protections are strong, setup is repeatable, migration support exists, and the implementation supports the completed owner and customer workflows.

The identified issues are not blockers. They are future hardening recommendations.

## APPROVED
