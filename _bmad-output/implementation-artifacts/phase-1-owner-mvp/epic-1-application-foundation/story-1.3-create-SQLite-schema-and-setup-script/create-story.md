# Story 1.3: Create SQLite Schema And Setup Script

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `story-[slug].md`

Workflow context: BMAD create-story output

Status: Reconstructed retrospective story document

## Story Title

Create SQLite Schema And Setup Script

## Business Context

The Barista Coffee Membership application is a prepaid cup ledger for a single coffee shop. The owner needs the app to store customer balances, package purchases, delivery history, and owner actions reliably. Without a database schema and setup process, the product cannot become a trusted replacement for paper notes, punch cards, or spreadsheets.

This story is part of the Application Foundation epic because it creates the persistence foundation for every later workflow. Admin authentication needs admin records. Customer management needs customer records. Package purchase recording needs purchase records and balance updates. Delivery recording needs history records. Dashboard metrics need stored customer, purchase, and delivery data. Customer portal and shared balance links later need read-only access to the same stored records.

SQLite is the correct MVP database because the product is single-shop, low-volume, low-maintenance, and locally runnable. The database schema must be simple enough to maintain but structured enough to protect ledger integrity.

## User Story

As the coffee shop owner,

I want the membership application to have a reliable local SQLite database schema and setup script,

So that customer accounts, package purchases, balances, deliveries, and owner activity can be stored consistently and used by future owner workflows.

## Acceptance Criteria

1. `database/schema.sql` exists.
2. `database/setup.js` exists.
3. `database/migrations.js` exists or migration support is available.
4. The setup script uses the configured SQLite database path.
5. The setup script creates the database directory if it does not already exist.
6. The setup script executes the schema SQL.
7. The setup script runs migrations.
8. The setup script seeds or confirms an initial admin user.
9. The schema includes an `admin_users` table.
10. The schema includes a `customer_accounts` table.
11. The schema includes a `package_purchases` table.
12. The schema includes a `delivery_history` table.
13. The schema includes an `admin_action_logs` table.
14. The schema enforces unique admin usernames.
15. The schema enforces unique customer phone numbers.
16. The schema enforces unique customer login identifiers.
17. The schema supports secure customer balance access tokens.
18. The schema prevents negative customer balances.
19. The schema limits package size values to supported package sizes.
20. The schema stores package purchase amounts in `amount_paid_cents`.
21. The schema supports positive multi-cup delivery quantities.
22. The schema stores delivery balance-after values.
23. The schema supports delivery void/cancel metadata without deleting delivery records.
24. The schema defines foreign key relationships for customer, admin, package purchase, and delivery records.
25. The schema includes indexes for common lookup and history queries.
26. The schema does not require external database infrastructure.

## Functional Requirements

The application must provide a SQL schema file for the local SQLite database.

The application must provide a setup script that initializes the database from the schema.

The setup script must use the configured database path from the environment configuration layer.

The setup script must create the database directory before opening the database if the directory does not exist.

The setup script must execute the schema SQL.

The setup script must run migrations so later schema changes can be applied consistently.

The setup script must seed or confirm an initial admin user so the owner can later access the admin portal.

The schema must support admin user records.

The schema must support customer account records.

The schema must support package purchase records.

The schema must support delivery history records.

The schema must support admin action log records.

The schema must support current customer balance tracking.

The schema must support future customer login and shared balance access needs.

The schema must support later dashboard metrics by storing data in queryable relational tables.

## Non-Functional Requirements

The schema must be simple enough for a small-shop MVP.

The schema must be reliable enough to support ledger-style trust in balances and history.

The setup script must be repeatable and suitable for local development.

The setup script must avoid requiring manual database commands.

The database must not require external infrastructure.

The schema must use constraints to prevent common data integrity errors.

The schema must use indexes for common lookup and history access patterns.

The implementation must support future evolution through migrations rather than forcing manual resets.

The implementation must keep database setup separate from route handlers and UI views.

## UI Requirements

This story has no direct UI requirement.

No owner-facing page should be created by this story.

No customer-facing page should be created by this story.

No dashboard, form, navigation element, QR section, notification component, package history card, or delivery history view should be created by this story.

The story indirectly supports future UI by ensuring that pages can read real persisted data once owner workflows are implemented.

## Database Requirements

The schema must define `admin_users`.

`admin_users` must store an id, username, password hash, role, created timestamp, and updated timestamp. Username must be unique.

The schema must define `customer_accounts`.

`customer_accounts` must store customer identity and contact data, including name, phone, optional email, login identifier, password hash, balance access token, current balance, and timestamps. Phone, login identifier, and balance access token must be unique. Current balance must not be negative.

The schema must define `package_purchases`.

`package_purchases` must store customer id, package size, bonus cups, total cups added, amount paid in cents, admin creator id, and timestamp. Package size must be limited to supported values. Amount paid must not be negative. Total cups added must be positive. Purchase records must reference customer and admin records.

The schema must define `delivery_history`.

`delivery_history` must store customer id, delivered cup quantity, balance after delivery, optional note, admin creator id, delivery timestamp, void timestamp, and voiding admin id. Delivered cup quantity must be positive. Balance after delivery must not be negative. Delivery records must reference customer and admin records.

The schema must define `admin_action_logs`.

`admin_action_logs` must store admin id, action type, target type, target id, message, and timestamp. It must support optional relationship to an admin user.

The schema must define indexes for customer lookup, package history, delivery history, and action log queries.

## Technical Notes

The delivered application uses `database/schema.sql` for schema definition.

The delivered application uses `database/setup.js` for setup.

The delivered application uses `database/migrations.js` for incremental schema changes.

The setup script imports `config.js` and uses `config.databasePath`.

The setup script opens SQLite through `openDatabase`.

The setup script reads the schema file with Node filesystem utilities.

The setup script creates the database directory recursively before opening the database.

The setup script executes the schema SQL through SQLite.

The setup script runs migrations after schema execution.

The setup script seeds or confirms the initial admin user using the admin user model.

Foreign key enforcement is handled by the database helper. The schema defines foreign keys, and `database/database.js` enables `PRAGMA foreign_keys = ON`.

The schema is intentionally focused on membership ledger needs. It excludes payment processing tables, order tables, loyalty reward tables, POS integration tables, and multi-shop tenancy tables.

## Testing Requirements

Testing must confirm that database setup can run successfully.

Testing must confirm that the configured SQLite database file can be created.

Testing must confirm that required tables exist after setup.

Testing must confirm that duplicate admin usernames are rejected.

Testing must confirm that duplicate customer phone numbers are rejected.

Testing must confirm that duplicate customer login identifiers are rejected.

Testing must confirm that negative customer balances are rejected.

Testing must confirm that unsupported package sizes are rejected.

Testing must confirm that negative package amounts are rejected.

Testing must confirm that non-positive delivery quantities are rejected.

Testing must confirm that negative delivery balance-after values are rejected.

Testing must confirm that foreign key relationships prevent invalid customer/admin references when foreign keys are enabled.

Testing must confirm that setup can create or confirm an initial admin user.

Later workflow tests should validate the schema through real app behavior: admin login, customer creation, package purchase recording, delivery recording, delivery voiding, dashboard metrics, customer portal history, and shared balance links.

## Definition of Done

Story 1.3 is done when `database/schema.sql` exists and defines the required tables.

Story 1.3 is done when `database/setup.js` exists and can initialize the configured SQLite database.

Story 1.3 is done when setup uses `config.databasePath`.

Story 1.3 is done when setup creates the database directory if needed.

Story 1.3 is done when setup executes schema SQL successfully.

Story 1.3 is done when migration support exists.

Story 1.3 is done when the initial admin user can be seeded or confirmed.

Story 1.3 is done when schema constraints protect key ledger data.

Story 1.3 is done when indexes support common lookup and history queries.

Story 1.3 is done when no external database infrastructure is required.

Story 1.3 is done when later owner workflow stories can use the schema without replacing the persistence foundation.
