# Story 1.4: Add Database Connection Helper

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 1.4 is to make database access consistent, reliable, and maintainable across the Owner MVP. The Barista Coffee Membership application depends on SQLite as its local source of truth for admin users, customers, package purchases, delivery history, balances, and dashboard metrics. A database schema and setup script are not enough by themselves. The application also needs a safe and reusable way for the server and model code to open the database and run queries.

For the coffee shop owner, the value is data reliability. The owner needs to trust that package purchases, delivery records, and balances are read and written from the same database with consistent behavior. If each feature opens SQLite differently, enables different settings, or handles query errors inconsistently, the ledger becomes harder to trust and maintain.

Story 1.4 therefore supports the business goal of replacing informal tracking with a dependable operational system. It creates a shared database helper so later stories can focus on owner workflows instead of repeatedly solving low-level database connection concerns.

## Epic Objective

Epic 1: Application Foundation creates the technical base for the Owner MVP. Story 1.4 belongs in this epic because it connects the Express application and SQLite schema to the model layer that later stories will use.

The epic objective is to make the app locally runnable, database-backed, and ready for business workflows. The database connection helper is part of that foundation. It establishes how application code opens SQLite, how it enables relational integrity, and how it performs basic statement, single-row, and multi-row operations.

The helper must be simple enough for the MVP but structured enough to prevent repeated ad hoc database access patterns. It should support both runtime app behavior and automated tests.

## Story Objective

The objective of Story 1.4 is to add a reusable SQLite database connection helper.

The helper should:

- Open the configured SQLite database.
- Allow callers to pass an explicit database path for tests or controlled contexts.
- Enable SQLite foreign key enforcement.
- Provide reusable helpers for running statements.
- Provide reusable helpers for reading one row.
- Provide reusable helpers for reading multiple rows.
- Log low-level SQLite errors in a consistent way.
- Be importable by setup scripts, migrations, models, and tests.

The delivered application implements this in `database/database.js`.

## User Value

The owner does not directly interact with the database helper, but every owner-facing workflow depends on it.

The helper enables:

- Admin authentication to read admin users.
- Customer management to create, search, and view customers.
- Package purchase recording to insert purchase rows and update balances.
- Delivery recording to insert delivery rows and update balances.
- Delivery voiding to restore balances and mark delivery records voided.
- Dashboard metrics to query customer, purchase, and delivery totals.
- Customer portal and shared links to read customer balances and histories.

The user value is reliability and consistency. A shared helper reduces the risk that one feature opens the wrong database, forgets foreign keys, or handles query errors differently from another feature.

## Acceptance Criteria

The story is accepted when the application has a reusable database helper that supports the SQLite-backed MVP.

Acceptance criteria:

1. `database/database.js` exists.
2. The helper imports the SQLite library.
3. The helper imports centralized configuration.
4. The helper exposes an `openDatabase` function.
5. `openDatabase` uses the configured database path by default.
6. `openDatabase` allows an explicit database path override.
7. `openDatabase` enables SQLite foreign key enforcement.
8. The helper exposes a reusable statement execution function.
9. The helper exposes a reusable single-row query function.
10. The helper exposes a reusable multi-row query function.
11. Query helper functions accept parameter arrays.
12. Query helper functions invoke callbacks with errors/results.
13. Low-level SQLite errors are logged consistently.
14. The helper can be used by setup scripts.
15. The helper can be used by model modules.
16. The helper can be used by tests with isolated database paths.
17. The helper does not contain product business rules.

## Dependencies

Story 1.4 depends on Story 1.2 because the helper should use the configured database path from `config.js`.

Story 1.4 depends on Story 1.3 because the helper opens the SQLite database initialized by the schema and setup script.

Story 1.4 depends on the SQLite MVP architecture decision. The helper is intentionally SQLite-specific.

Later stories depend heavily on Story 1.4:

- `models/admin-user.js` depends on query helpers.
- `models/customer-account.js` depends on query helpers.
- `models/package-purchase.js` depends on query helpers.
- `models/delivery-history.js` depends on query helpers.
- `models/dashboard.js` depends on query helpers.
- `database/setup.js` depends on `openDatabase`.
- `database/migrations.js` depends on query helpers.
- Automated tests depend on the ability to open isolated SQLite databases.

## Risks

Risk: Each model opens SQLite independently.

Impact: Database access behavior becomes inconsistent and harder to test.

Mitigation: Provide a shared `openDatabase` helper.

Risk: Foreign keys are not enabled.

Impact: SQLite may not enforce relationships between admins, customers, purchases, and deliveries.

Mitigation: Run `PRAGMA foreign_keys = ON` whenever a database is opened.

Risk: Query helpers hide too much behavior.

Impact: Debugging becomes harder if SQL errors are swallowed.

Mitigation: Log low-level SQLite errors while still passing errors to callbacks.

Risk: Helper becomes a business-logic layer.

Impact: Package, balance, delivery, or dashboard rules become mixed with database plumbing.

Mitigation: Keep helper limited to database opening and basic query execution.

Risk: Tests cannot isolate databases.

Impact: Automated tests become flaky or destructive.

Mitigation: Allow explicit database path overrides.

## Priority

Priority: High

Story 1.4 is high priority because every model and workflow that reads or writes SQLite depends on database access. It should be delivered before owner authentication, customer management, package purchases, deliveries, dashboards, and customer portal workflows.

The helper is a small implementation item but has broad impact. Implementing it early prevents duplicated connection code across the application.

## Success Metrics

Success metric 1: `database/database.js` exists and exports the expected helper functions.

Success metric 2: The app can open the configured SQLite database.

Success metric 3: Tests can open explicit temporary SQLite databases.

Success metric 4: Foreign key enforcement is enabled after opening the database.

Success metric 5: Model modules can use shared helpers for statement execution and row queries.

Success metric 6: Setup and migration scripts can reuse the database helper.

Success metric 7: Later workflow tests pass without replacing the database access layer.

Success metric 8: No product business rules are placed in the helper.

## Traceability To Completed Application

The completed application confirms that this story was delivered.

Delivered evidence:

- `database/database.js` exists.
- `openDatabase` opens the configured SQLite database by default.
- `openDatabase` allows an explicit database path override.
- `openDatabase` enables `PRAGMA foreign_keys = ON`.
- `runStatement` provides reusable write/statement execution.
- `getRow` provides reusable single-row reads.
- `getAllRows` provides reusable multi-row reads.
- `database/setup.js` uses `openDatabase`.
- `database/migrations.js` uses `runStatement` and `getAllRows`.
- Models use `getRow`, `getAllRows`, and `runStatement`.
- Tests use explicit database paths and app options for isolated databases.

The helper now supports the full delivered Owner MVP, Customer Portal, QR/shared balance links, dashboard metrics, delivery voiding, password reset, and automated test suite.
