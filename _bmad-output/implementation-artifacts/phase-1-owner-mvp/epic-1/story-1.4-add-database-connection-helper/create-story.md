# Story 1.4: Add Database Connection Helper

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `story-[slug].md`

Workflow context: BMAD create-story output

Status: Reconstructed retrospective story document

## Story Title

Add Database Connection Helper

## Business Context

The Barista Coffee Membership application is a prepaid cup ledger for a small coffee shop. The owner needs the app to reliably store and retrieve customers, package purchases, balances, delivery history, and dashboard data. That reliability depends not only on having a SQLite schema, but also on having a consistent way for application code to open and query the database.

Story 1.4 is part of the Application Foundation epic because it connects the Express application and SQLite schema to the model layer used by later business workflows. Without a shared database helper, each model or setup script could open SQLite differently, forget foreign key enforcement, use the wrong database path, or handle query errors inconsistently.

The business reason for this story is trust in the ledger. The owner must be confident that all workflows read from and write to the same database with the same integrity behavior. A shared database connection helper reduces operational risk and makes later owner features easier to implement and test.

## User Story

As the project team building the Owner MVP,

I want a reusable SQLite database connection helper,

So that setup scripts, migrations, model functions, and tests can open the database consistently, enforce foreign key relationships, and perform basic query operations without duplicating database access code.

## Acceptance Criteria

1. `database/database.js` exists.
2. The helper imports the SQLite library.
3. The helper imports centralized application configuration.
4. The helper exports `openDatabase`.
5. `openDatabase` uses the configured database path by default.
6. `openDatabase` accepts an explicit database path override.
7. `openDatabase` enables SQLite foreign key enforcement.
8. The helper exports `runStatement`.
9. `runStatement` executes write/statement SQL with parameters.
10. `runStatement` returns errors and statement metadata through a callback.
11. The helper exports `getRow`.
12. `getRow` reads a single row with parameters.
13. The helper exports `getAllRows`.
14. `getAllRows` reads multiple rows with parameters.
15. Query helper functions log low-level SQLite errors.
16. Query helper functions do not swallow errors.
17. The helper can be used by setup scripts.
18. The helper can be used by migrations.
19. The helper can be used by model modules.
20. The helper can be used by automated tests with isolated database paths.
21. The helper does not contain membership business rules.

## Functional Requirements

The application must provide a reusable database helper module under the `database/` folder.

The helper must open the configured SQLite database when no explicit database path is supplied.

The helper must allow an explicit database path to be supplied. This supports tests and controlled runtime contexts.

The helper must enable SQLite foreign key enforcement after opening the database.

The helper must provide a function for running SQL statements such as inserts, updates, deletes, and schema operations.

The helper must provide a function for retrieving a single row.

The helper must provide a function for retrieving multiple rows.

The helper functions must support parameterized SQL calls.

The helper functions must provide errors to callers through callbacks.

The helper functions must log low-level SQLite errors in a consistent way.

The helper must be importable from setup scripts, migrations, and model modules.

## Non-Functional Requirements

The helper must be simple and maintainable.

The helper must not become an ORM.

The helper must not hide SQL behavior behind a large abstraction.

The helper must preserve separation of concerns. Database plumbing belongs in the helper; membership business rules belong in model modules.

The helper must support local runnability by using the configured SQLite path.

The helper must support testability by accepting explicit database path overrides.

The helper must support ledger reliability by enabling foreign key enforcement.

The helper must be understandable to future maintainers. A developer should be able to read the file and quickly understand how the app opens SQLite and runs queries.

## UI Requirements

This story has no direct UI requirements.

No owner-facing page should be created.

No customer-facing page should be created.

No navigation, form, dashboard component, QR control, history section, notification component, or layout change should be introduced by this story.

The helper supports UI indirectly because later views depend on model data loaded through database helpers.

## Database Requirements

The helper must use SQLite.

The helper must use the configured database path by default.

The helper must allow explicit database path overrides.

The helper must enable `PRAGMA foreign_keys = ON` on opened connections.

The helper must not create or modify schema by itself.

The helper must not create business records by itself.

The helper must support statement execution and row retrieval against the SQLite database.

The helper must be usable by database setup and migration code.

The helper must be usable by model code that reads and writes business records.

## Technical Notes

The delivered implementation uses `database/database.js`.

The helper imports `sqlite3` and calls `sqlite3.verbose()`.

The helper imports `config.js`.

`openDatabase(databasePath)` resolves the path by using the explicit `databasePath` argument when provided, otherwise using `config.databasePath`.

`openDatabase()` creates a new SQLite database connection.

`openDatabase()` logs a message if opening SQLite fails.

`openDatabase()` runs:

```sql
PRAGMA foreign_keys = ON
```

`runStatement(database, sql, params, callback)` wraps `database.run`.

`getRow(database, sql, params, callback)` wraps `database.get`.

`getAllRows(database, sql, params, callback)` wraps `database.all`.

Each helper defaults missing `params` to an empty array.

Each query helper logs SQLite errors and forwards errors to the callback.

The helper exports `openDatabase`, `runStatement`, `getRow`, and `getAllRows`.

## Testing Requirements

Testing must confirm that the helper can open the configured SQLite database.

Testing must confirm that the helper can open an explicit temporary database path.

Testing must confirm that foreign key enforcement is enabled on opened connections.

Testing must confirm that `runStatement` can execute parameterized statements.

Testing must confirm that `getRow` can retrieve a single row.

Testing must confirm that `getAllRows` can retrieve multiple rows.

Testing must confirm that database setup can use `openDatabase`.

Testing must confirm that model modules can use the helper functions.

Testing must confirm that automated tests can use isolated database paths without mutating the local app database.

Later workflow tests should indirectly validate the helper through admin authentication, customer management, package purchase, delivery, dashboard, customer portal, shared access link, and password reset workflows.

## Definition of Done

Story 1.4 is done when `database/database.js` exists.

Story 1.4 is done when `openDatabase` is implemented and exported.

Story 1.4 is done when `openDatabase` uses `config.databasePath` by default.

Story 1.4 is done when `openDatabase` accepts an explicit path override.

Story 1.4 is done when `openDatabase` enables SQLite foreign keys.

Story 1.4 is done when `runStatement` is implemented and exported.

Story 1.4 is done when `getRow` is implemented and exported.

Story 1.4 is done when `getAllRows` is implemented and exported.

Story 1.4 is done when helper functions support parameter arrays.

Story 1.4 is done when helper functions return errors to callbacks.

Story 1.4 is done when setup, migrations, models, and tests can use the helper.

Story 1.4 is done when no product business rules are implemented in the helper.
