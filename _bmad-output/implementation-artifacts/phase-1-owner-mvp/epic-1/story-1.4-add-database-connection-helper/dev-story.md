# Story 1.4: Add Database Connection Helper

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: CODE

Workflow context: BMAD dev-story output

Status: Implemented / Delivered

## Implementation Evidence Summary

Story 1.4 delivered the reusable SQLite database connection helper for the Barista Coffee Membership application. This is implementation evidence, not a planning document. The completed application is the source of truth.

The database helper exists because the Owner MVP is a ledger-backed web app. Every meaningful workflow depends on consistent database access: admin login, customer creation, package purchases, delivery history, delivery voiding, dashboard metrics, customer portal views, shared balance links, and password reset.

The delivered helper lives in `database/database.js`. It opens SQLite, uses the configured database path by default, supports explicit database path overrides, enables foreign key enforcement, and provides reusable helpers for SQL statements and row queries.

## Files Created

### `database/database.js`

Why it exists:

`database/database.js` centralizes SQLite access for the application.

What problem it solves:

Without this helper, setup scripts, migrations, models, and tests could all open SQLite differently. That would create inconsistent behavior and increase the chance that a feature forgets to enable foreign keys or uses the wrong database path.

How it works:

The file imports `sqlite3`, imports centralized configuration, and exports four helper functions:

- `openDatabase`
- `runStatement`
- `getRow`
- `getAllRows`

`openDatabase()` opens the configured SQLite database by default and enables foreign keys. The query helpers wrap `database.run`, `database.get`, and `database.all`.

## Files Modified

### `database/setup.js`

Why it was modified:

The setup script needs to open the SQLite database through the shared helper.

What problem it solves:

It prevents setup code from duplicating connection behavior. Setup and runtime code both use the same database-opening path.

How it works:

`database/setup.js` imports `openDatabase` and calls it with `config.databasePath`:

```js
const database = openDatabase(config.databasePath);
```

### `database/migrations.js`

Why it was modified:

Migrations need to run SQL statements and read SQLite metadata.

What problem it solves:

It lets migration logic reuse the same statement and query wrappers as the rest of the app.

How it works:

`database/migrations.js` imports `getAllRows` and `runStatement` from `database/database.js`. It wraps them in promise helpers for migration control flow.

### Model files

Why they were modified:

Model files need consistent query execution.

What problem it solves:

It keeps business logic separate from low-level database plumbing. Models can focus on admin users, customers, package purchases, deliveries, dashboard metrics, and password behavior.

How it works:

Model files import helper functions such as `getRow`, `getAllRows`, and `runStatement` instead of opening SQLite directly.

Examples in the delivered app include:

- `models/admin-user.js`
- `models/customer-account.js`
- `models/package-purchase.js`
- `models/delivery-history.js`
- `models/dashboard.js`

### Test files

Why they were modified:

Tests need isolated database paths and database objects.

What problem it solves:

It prevents automated tests from mutating the real local app database.

How it works:

Tests call `openDatabase(databasePath)` with temporary database paths and pass database instances or paths into `createApp()`.

## Database Changes

No schema changes were introduced by Story 1.4.

Why:

The story implements connection and query helpers, not database structure.

What problem this avoids:

It keeps database schema work separate from database access work. Story 1.3 owns schema/setup. Story 1.4 owns reusable database access.

Delivered database behavior:

- The app can open the configured SQLite database.
- Tests can open explicit temporary SQLite databases.
- Foreign key enforcement is enabled after opening the database.
- Query helpers support parameterized SQL operations.

## Routes Added

No routes were added by Story 1.4.

Why:

Database access helpers are infrastructure, not HTTP behavior.

What problem this avoids:

It keeps route implementation separate from database plumbing.

How it works:

Later route handlers call model functions. Those model functions use the database helper. Routes do not directly depend on low-level SQLite APIs.

## Models Added

No membership model was added by Story 1.4.

Why:

The story does not create a domain concept such as customer, package purchase, delivery, or dashboard metric.

What problem this avoids:

It prevents database infrastructure from becoming business logic.

How it works:

The helper is used by models, but it is not itself a business model. It exports database utility functions only.

## UI Components Added

No UI components were added by Story 1.4.

Why:

The story has no direct owner-facing or customer-facing UI.

What problem this avoids:

It prevents UI scope from being mixed into foundation database infrastructure work.

How it works:

The helper indirectly supports UI because later rendered pages read model data through helper-backed database queries.

## Business Logic Implemented

Story 1.4 implements no membership business rules.

Why:

The helper must remain a database utility. Business rules belong in model modules.

What problem this solves:

It keeps package pricing, bonus rules, delivery validation, balance updates, dashboard calculations, customer authorization, and password reset behavior out of low-level database plumbing.

How it works:

The helper provides generic operations. Business models decide which SQL to run and how to interpret results.

Delivered boundary:

- `database/database.js` opens and queries SQLite.
- `models/*` implement app-specific behavior.
- `routes/*` handle HTTP workflows.

## Validation Rules

### Database path resolution

Why it exists:

The helper needs to know which SQLite file to open.

What problem it solves:

It allows normal app usage to use the configured database while tests can pass isolated temporary paths.

How it works:

```js
const resolvedDatabasePath = databasePath || config.databasePath;
```

### Parameter defaulting

Why it exists:

Some SQL statements do not need parameters.

What problem it solves:

It prevents callers from having to pass empty arrays for every query.

How it works:

Each query helper uses:

```js
const statementParams = params || [];
```

### Error forwarding

Why it exists:

Callers need to know when database operations fail.

What problem it solves:

It prevents silent database failures.

How it works:

The helpers log SQLite errors and pass the error to the callback.

## Security Controls

### Foreign key enforcement

Why it exists:

SQLite foreign keys must be enabled on the connection.

What problem it solves:

It protects relationships between customers, admins, package purchases, and deliveries.

How it works:

`openDatabase()` runs:

```js
database.run('PRAGMA foreign_keys = ON');
```

### No credential or secret handling

Why it exists:

The database helper should not manage passwords or secrets.

What problem it solves:

It avoids mixing security-sensitive business behavior into low-level database utilities.

How it works:

Password hashing lives in `models/password.js`; session secrets live in `config.js` and `server.js`.

### Parameterized query support

Why it exists:

SQL statements should use parameter arrays for dynamic values.

What problem it solves:

It supports safer query patterns and avoids ad hoc string interpolation in helper-backed calls.

How it works:

The helper functions pass parameter arrays into SQLite's `run`, `get`, and `all` methods.

## Test Coverage

Story 1.4 is covered through the completed app's automated tests.

Why indirect coverage is meaningful:

Every major workflow uses model functions backed by the database helper. If the helper could not open databases, run statements, read rows, or enforce foreign keys, the current tests would fail.

Evidence from current tests:

- Tests open isolated SQLite databases with explicit database paths.
- Tests create app instances with test database objects or paths.
- Admin authentication tests use helper-backed admin queries.
- Customer management tests use helper-backed customer queries.
- Package purchase tests use helper-backed purchase and balance operations.
- Delivery tests use helper-backed delivery operations.
- Dashboard tests use helper-backed aggregate queries.
- Customer portal tests use helper-backed customer, package, delivery, and token queries.

Relevant test files:

- `tests/admin-auth.test.js`
- `tests/phase1-owner.test.js`
- `tests/customer-portal.test.js`
- `tests/e2e-owner-customer-flow.test.js`

Current test command:

```sh
npm test
```

Current QA evidence:

The completed application has 30 passing automated tests, which confirms the helper supports the delivered application behavior.

## Final Delivered Implementation Result

Story 1.4 delivered the database access helper required by the Owner MVP.

The implementation exists in `database/database.js` and provides the shared SQLite access functions used across setup, migrations, models, and tests. It keeps database plumbing centralized, enables foreign key enforcement, supports test database isolation, and avoids mixing business rules into low-level database code.

No routes, UI components, schema changes, or product business rules were added by this story. That is the correct delivered outcome.
