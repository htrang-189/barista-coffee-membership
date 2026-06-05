# Story 1.4: Add Database Connection Helper

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: Updated Plan

Workflow context: BMAD correct-course output

Status: Complete / Delivered

## Correct-Course Summary

Story 1.4 started as a simple database connection helper story. The final delivered solution kept that simplicity but clarified several important implementation details: the helper must use the configured database path, allow test path overrides, enable SQLite foreign keys, provide reusable query helpers, and remain free of product business rules.

The correction was not a major architectural pivot. It was a refinement that made the helper strong enough to support the full delivered application while staying appropriately lightweight for the Owner MVP.

## Problem Discovered

The problem discovered was that simply "opening SQLite" was not specific enough for the completed application.

The app needed a helper that could solve several real implementation problems:

- Runtime code needed to open the configured local SQLite database.
- Automated tests needed to open temporary isolated SQLite databases.
- Setup and migration scripts needed to reuse the same connection behavior.
- Model modules needed statement and row query helpers.
- SQLite foreign key enforcement needed to be enabled for every opened connection.
- Low-level SQL errors needed to be visible during development and test runs.

If the helper only opened a database file, later stories would still duplicate query execution and might forget important connection behavior.

## Root Cause

The root cause was that database access is a cross-cutting foundation concern. It affects setup, migrations, models, route workflows, and tests.

SQLite also has an important runtime characteristic: foreign key definitions in the schema are not enough unless foreign key enforcement is enabled on the connection. A minimal helper that only calls `new sqlite3.Database(...)` would not fully protect ledger integrity.

Another root cause was test isolation. The application needed to support temporary test databases. If the helper always opened only the default local database path, tests could mutate real local data or become dependent on shared state.

The initial assumption therefore needed to be refined from "add a connection helper" to "add a connection and query helper that supports configuration, foreign key enforcement, reusable queries, and test isolation."

## Decision Taken

The decision was to implement `database/database.js` as a small but complete SQLite helper module.

The delivered helper exports:

- `openDatabase`
- `runStatement`
- `getRow`
- `getAllRows`

The helper uses `config.databasePath` by default but accepts an explicit path override. This supports normal runtime behavior and isolated tests.

The helper enables SQLite foreign keys by running:

```sql
PRAGMA foreign_keys = ON
```

The helper logs low-level SQLite errors and passes errors back through callbacks.

The helper intentionally does not implement membership business logic. It is infrastructure only.

## Updated Implementation Plan

The updated implementation plan became:

1. Create `database/database.js`.
2. Import `sqlite3` and `config.js`.
3. Implement `openDatabase(databasePath)`.
4. Resolve the database path from the explicit argument or `config.databasePath`.
5. Open the SQLite database with the resolved path.
6. Log database open errors if they occur.
7. Enable foreign key enforcement after opening the database.
8. Implement `runStatement(database, sql, params, callback)`.
9. Implement `getRow(database, sql, params, callback)`.
10. Implement `getAllRows(database, sql, params, callback)`.
11. Default missing query parameter arrays to empty arrays.
12. Log SQLite query errors.
13. Pass errors and results back to callbacks.
14. Export all helper functions.
15. Keep product business rules in model modules.

The final delivered application follows this updated plan.

## Impact On Architecture

The impact on architecture was positive and contained.

The helper reinforced the existing separation of concerns:

- `database/database.js` handles SQLite access.
- `database/schema.sql` handles schema definition.
- `database/setup.js` handles database setup.
- `database/migrations.js` handles schema evolution.
- `models/*` handle business behavior.
- `routes/*` handle HTTP workflows.

The helper did not introduce a new framework, ORM, or external database service. This kept the architecture aligned with the low-maintenance MVP.

The helper also made the architecture more testable. Tests can open explicit database paths and avoid mutating the real local database.

## Impact On Future Stories

The updated helper improved future story delivery across the application.

Impact on setup and migrations:

`database/setup.js` and `database/migrations.js` reuse the helper instead of opening SQLite independently.

Impact on owner authentication:

Admin user lookup and creation use helper-backed queries.

Impact on customer management:

Customer creation, duplicate checks, search, detail retrieval, and password reset use helper-backed database operations.

Impact on package purchase workflows:

Package purchase creation and balance crediting use model logic backed by the helper.

Impact on delivery workflows:

Delivery creation, over-balance checks, and delivery voiding use helper-backed database operations.

Impact on dashboard metrics:

Dashboard aggregate queries use the same helper pattern.

Impact on customer portal:

Customer balance, package history, delivery history, and shared access lookup all depend on helper-backed model code.

Impact on testing:

Tests use explicit database paths and app options to isolate data.

## Lessons From The Adjustment

The first lesson is that a small helper can carry major data-integrity responsibility. Enabling SQLite foreign keys in the helper is a small implementation detail with large product impact.

The second lesson is that testability should be considered in foundation code. Allowing explicit database path overrides made the later automated test suite much cleaner.

The third lesson is that infrastructure helpers should stay infrastructure-focused. Keeping business rules out of `database/database.js` made later model code easier to reason about.

The fourth lesson is that low-level error logging is useful in a local MVP. It gives maintainers visibility into SQL failures without adding a complex observability stack.

The fifth lesson is that the right abstraction for this project is small and explicit. The app did not need an ORM. It needed a focused SQLite helper that matches the codebase's scale.

## Final Updated Plan Status

Updated plan status: Implemented / Delivered

The correction was successful. Story 1.4 delivered a reusable database helper that supports setup, migrations, models, tests, foreign key enforcement, and the full completed application without overcomplicating the MVP architecture.
