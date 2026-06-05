# Story 1.3: Create SQLite Schema And Setup Script

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: CODE

Workflow context: BMAD dev-story output

Status: Implemented / Delivered

## Implementation Evidence Summary

Story 1.3 delivered the SQLite persistence foundation for the Barista Coffee Membership application. This is implementation evidence, not a planning document. The current completed application is the source of truth.

The story exists because the Owner MVP is a ledger. The owner needs customer balances, package purchases, delivery records, voided delivery states, and dashboard metrics to persist reliably. A web server without a schema and setup script would not be enough to replace spreadsheets or paper tracking.

The implementation provides a local SQLite schema, a repeatable setup script, and migration support. These pieces allow the app to initialize a local database, enforce core constraints, seed or confirm an initial admin user, and evolve the schema as later features are added.

## Files Created

### `database/schema.sql`

Why it exists:

`database/schema.sql` defines the database structure used by the delivered application. It is the source of truth for the local SQLite schema.

What problem it solves:

It prevents the app from relying on manual database creation. The owner/developer workflow needs a repeatable schema so local setup is predictable.

How it works:

The file contains SQL statements that create the application's core tables and indexes if they do not already exist. It starts with `PRAGMA foreign_keys = ON` and defines tables for admin users, customers, package purchases, delivery history, and admin action logs.

### `database/setup.js`

Why it exists:

`database/setup.js` initializes the local SQLite database.

What problem it solves:

It removes manual setup steps. Without this script, a developer or maintainer would need to open SQLite and run schema SQL manually. That would make local setup fragile.

How it works:

The script reads `database/schema.sql`, creates the directory for the configured database path, opens the configured SQLite database, executes the schema SQL, runs migrations, and seeds or confirms the initial admin user.

It can be run through:

```sh
npm run db:setup
```

### `database/migrations.js`

Why it exists:

`database/migrations.js` supports schema evolution after the initial schema exists.

What problem it solves:

The application evolved during implementation. Later delivered features required customer balance access tokens, multi-cup deliveries, and delivery voiding support. Migration support prevented those changes from requiring manual database replacement.

How it works:

The migration module checks table columns, adds missing balance access token support, backfills missing tokens, creates a unique token index, and rebuilds delivery history when needed to support multi-cup quantities and void metadata.

## Files Modified

### `package.json`

Why it was modified:

`package.json` includes the database setup command.

What problem it solves:

It gives the project a standard way to initialize the local database. The setup command is discoverable and repeatable.

How it works:

The delivered scripts include:

```json
"db:setup": "node database/setup.js"
```

### `package-lock.json`

Why it was modified:

The lock file captures the dependencies used by the database-backed application.

What problem it solves:

It makes dependency installation reproducible, including the SQLite dependency.

How it works:

The lock file records the resolved dependency tree for npm.

### `database/database.js`

Why it was involved:

The setup script uses the database helper to open SQLite.

What problem it solves:

It centralizes database opening and foreign key enforcement.

How it works:

`openDatabase()` opens the configured SQLite file and runs:

```sql
PRAGMA foreign_keys = ON
```

This ensures foreign key relationships defined in the schema are enforced at runtime.

### `models/admin-user.js`

Why it was involved:

The setup script uses the admin user model to seed or confirm an initial admin user.

What problem it solves:

It avoids duplicating password hashing and admin creation behavior directly in the setup script.

How it works:

`setup.js` calls `createAdminUser(database, username, password)`. The model hashes the password and inserts the admin user only if one does not already exist.

## Database Changes

### `admin_users`

Why it exists:

The owner needs an admin account to access the admin portal.

What problem it solves:

It provides persistent admin identity and credential storage.

How it works:

The table stores id, username, password hash, role, created timestamp, and updated timestamp. Username is unique.

### `customer_accounts`

Why it exists:

The owner needs to manage membership customers, balances, credentials, and shared access tokens.

What problem it solves:

It provides the central customer record used by owner workflows, customer login, and shared balance links.

How it works:

The table stores customer identity, contact details, login identifier, password hash, balance access token, current balance, and timestamps. Phone, login identifier, and balance access token are unique. Current balance cannot be negative.

### `package_purchases`

Why it exists:

The owner needs to record package purchases and credited cups.

What problem it solves:

It creates an auditable purchase history and supports dashboard revenue and bonus metrics.

How it works:

The table stores customer id, package size, bonus cups, total cups added, amount paid in cents, admin creator id, and timestamp. It references customer and admin records. It constrains package size to `10`, `20`, or `30`, prevents negative bonus and amount values, and requires total cups added to be positive.

### `delivery_history`

Why it exists:

The owner needs to record cup usage and preserve delivery history.

What problem it solves:

It records consumption events, supports customer-facing usage history, supports dashboard delivered-cup totals, and allows mistaken deliveries to be voided without deletion.

How it works:

The table stores customer id, delivered cup quantity, balance after delivery, optional note, admin creator id, delivery timestamp, void timestamp, and voiding admin id. Delivered cup quantity must be positive. Balance after delivery cannot be negative. Records reference customer and admin tables.

### `admin_action_logs`

Why it exists:

The system needs a place to retain owner/admin operational action history.

What problem it solves:

It supports traceability for owner actions without mixing action messages into business tables.

How it works:

The table stores admin user id, action type, target type, target id, message, and timestamp.

### Indexes

Why they exist:

The app frequently searches customers and reads purchase/delivery history.

What problem they solve:

Indexes improve lookup and history query performance as the ledger grows.

How they work:

The schema creates indexes for customer phone, customer login identifier, customer balance, package purchase customer/date/package size, delivery customer/date, and admin action log admin/date.

## Routes Added

No routes were added by Story 1.3.

Why:

The story is a database foundation story. It creates persistence support but does not implement HTTP behavior.

What problem this avoids:

It keeps schema/setup work separate from owner-facing route behavior. Admin login, customer management, package purchases, and deliveries are later stories.

How it works:

Later routes use model functions that rely on this schema. The schema itself does not expose routes.

## Models Added

### Admin user setup integration

Why it exists:

The setup script needs to create or confirm an initial admin user.

What problem it solves:

The owner needs an admin identity before admin login can work. Using the admin user model avoids duplicating credential logic.

How it works:

`database/setup.js` imports `createAdminUser` from `models/admin-user.js`. It uses `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment values when provided, or local development defaults.

### Migration integration with customer account model

Why it exists:

Migrations need to backfill missing balance access tokens for existing customer records.

What problem it solves:

When shared balance links were added later, existing customers needed secure tokens without manual updates.

How it works:

`database/migrations.js` imports `backfillMissingBalanceAccessTokens` from `models/customer-account.js` and calls it after ensuring the token column exists.

## UI Components Added

No UI components were added by Story 1.3.

Why:

The story's output is database infrastructure. It should not create owner or customer screens.

What problem this avoids:

It prevents UI work from being mixed with database setup. Keeping the story focused made later UI stories easier to implement.

How it works:

Later admin and customer views read from tables created by this story, but this story itself adds no rendered components.

## Business Logic Implemented

### Initial admin seeding

Why it exists:

The app needs at least one admin user to make owner authentication possible.

What problem it solves:

It prevents the local database from being initialized without any way for the owner to log in later.

How it works:

`seedInitialAdmin()` reads `ADMIN_USERNAME` and `ADMIN_PASSWORD`, defaults to local development values when missing, and calls `createAdminUser()`.

### Migration behavior

Why it exists:

The schema needs to evolve as the delivered app gains features.

What problem it solves:

It prevents manual schema changes and reduces the need for database resets.

How it works:

`runMigrations()` ensures balance access tokens and delivery quantity/void support are present.

### No package/delivery balance business logic

Why it matters:

Story 1.3 should not implement balance mutations. It only provides tables and constraints.

What problem this solves:

It keeps ledger actions in later model stories where they can be tested as business behavior.

How it works:

Package purchases and deliveries are implemented in later model/route code that uses the schema.

## Validation Rules

### Unique admin username

Why it exists:

Admin usernames must identify a single admin account.

What problem it solves:

It prevents ambiguous admin login records.

How it works:

`admin_users.username` is declared `UNIQUE`.

### Unique customer phone

Why it exists:

Phone number is a required customer identifier in the owner workflow.

What problem it solves:

It prevents duplicate customer records for the same phone number.

How it works:

`customer_accounts.phone` is declared `UNIQUE`.

### Unique customer login identifier

Why it exists:

Customer login later depends on a unique identifier.

What problem it solves:

It prevents ambiguous customer authentication.

How it works:

`customer_accounts.login_identifier` is declared `UNIQUE`.

### Unique balance access token

Why it exists:

Shared balance links must identify exactly one customer.

What problem it solves:

It prevents token collisions and cross-customer data exposure.

How it works:

`customer_accounts.balance_access_token` is declared `UNIQUE`, and migrations create a unique index when backfilling older databases.

### Non-negative balances

Why it exists:

A prepaid ledger should not store negative current balances.

What problem it solves:

It protects the owner from invalid balance data.

How it works:

`customer_accounts` includes:

```sql
CHECK (current_balance >= 0)
```

### Supported package sizes

Why it exists:

The delivered app supports package sizes `10`, `20`, and `30`.

What problem it solves:

It prevents invalid package sizes from entering purchase history.

How it works:

`package_purchases` includes:

```sql
CHECK (package_size IN (10, 20, 30))
```

### Positive delivery quantities

Why it exists:

Delivery records must represent actual cup usage.

What problem it solves:

It prevents zero or negative delivery records.

How it works:

`delivery_history` includes:

```sql
CHECK (delivered_cups > 0)
```

## Security Controls

### Password hash storage

Why it exists:

Admin and customer credentials must not store raw passwords.

What problem it solves:

It prevents credential disclosure through database inspection.

How it works:

The schema stores `password_hash` fields, and setup uses `createAdminUser()` to hash the initial admin password.

### Foreign key relationships

Why they exist:

Package purchases and deliveries should belong to valid customers and admins.

What problem they solve:

They prevent orphaned ledger events.

How they work:

The schema declares foreign keys, and `database/database.js` enables foreign key enforcement.

### Access token uniqueness

Why it exists:

Shared balance links are bearer-style customer access links.

What problem it solves:

It prevents multiple customers from sharing the same access token.

How it works:

The schema and migrations enforce unique balance access tokens.

## Test Coverage

Story 1.3 is tested directly and indirectly through the completed app's automated suite.

Why indirect coverage matters:

The schema is used by every major workflow. If required tables, constraints, or relationships were missing, later tests would fail when creating admins, customers, package purchases, deliveries, dashboard data, customer portal views, or shared access links.

Evidence from current tests:

- Admin authentication tests require `admin_users`.
- Customer management tests require `customer_accounts`.
- Package purchase tests require `package_purchases`.
- Delivery tests require `delivery_history`.
- Dashboard tests require customer, package, and delivery records.
- Customer portal tests require customer balance, package history, delivery history, and token data.
- Password reset tests require customer credential storage.

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

The completed application has 30 passing automated tests. Those tests validate that the schema and setup support the delivered product.

## Final Delivered Implementation Result

Story 1.3 delivered the database foundation for the application.

Files created include `database/schema.sql`, `database/setup.js`, and `database/migrations.js`. The schema defines the tables, constraints, indexes, and relationships needed by the membership ledger. The setup script initializes the configured SQLite database and seeds or confirms the initial admin user. The migration file supports later schema evolution for balance access tokens and delivery voiding.

No routes or UI components were added by this story, which is correct. The story's value is persistence and setup. Later owner and customer workflows use the data foundation created here.
