# Story 1.3: Create SQLite Schema And Setup Script

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 1.3 is to create the persistent data foundation for the Owner MVP. The coffee shop owner needs the application to become the reliable source of truth for prepaid cup memberships. That requires more than screens and forms. The app must have a database schema that can store admins, customers, package purchases, delivery history, balances, and operational history in a consistent way.

The product exists to reduce the risk of paper notes, punch cards, and spreadsheets. Those tools can lose information, make balance corrections unclear, and create disputes about how many cups a customer has remaining. A SQLite schema and setup script solve this by giving the application a repeatable local database structure.

The business goal is not to create database infrastructure for its own sake. The goal is to protect trust in the membership ledger. If the owner records a package purchase or delivery, the data must persist and remain connected to the correct customer and admin action. Story 1.3 creates the foundation for that reliability.

## Epic Objective

Epic 1: Application Foundation provides the technical base for the Owner MVP. Within that epic, Story 1.3 focuses on the database schema and setup process.

The epic objective is to make the web application locally runnable, database-backed, and ready for later owner workflows. The schema and setup script are essential to that objective because later stories cannot safely implement admin authentication, customer management, package purchases, deliveries, dashboard metrics, or customer portal behavior without a defined data model.

The schema should support the current MVP and avoid unnecessary complexity. It should use SQLite because the product is single-shop, low volume, and local-first. It should include constraints that prevent obvious data corruption. It should be easy to initialize through a script, not manual database work.

## Story Objective

The objective of Story 1.3 is to create the SQLite schema and setup script required by the Owner MVP.

The story should define the foundational tables needed by the app and provide a command-driven setup path so the local database can be initialized consistently. The delivered application uses `database/schema.sql`, `database/setup.js`, and `database/migrations.js` to meet this need.

The schema must support:

- Admin users.
- Customer accounts.
- Package purchases.
- Delivery history.
- Admin action logging.
- Balance tracking.
- Future customer access token behavior.
- Delivery void/cancel behavior.

The setup script must support:

- Creating the database directory.
- Opening the configured SQLite database.
- Executing the schema.
- Running migrations.
- Seeding or confirming the initial admin user.

## User Value

The primary user value is owner confidence. The owner needs to trust that customer balances and history are stored correctly. A clear SQLite schema gives the app a stable way to record the events that matter to the membership program.

For the owner, this story enables later visible workflows:

- Logging in as admin.
- Creating customers.
- Recording package purchases.
- Crediting bonus cups.
- Recording multi-cup deliveries.
- Voiding mistaken deliveries.
- Viewing dashboard metrics.
- Reviewing histories.

For customers, this story indirectly supports future read-only balance visibility. Customer-facing pages are only useful if the underlying data model stores accurate customer balances, package history, and delivery history.

For maintainers, this story provides a repeatable local setup path. The database can be initialized with a script instead of relying on manual SQL execution.

## Acceptance Criteria

The story is accepted when the SQLite schema and setup script provide a reliable local database foundation for the application.

Acceptance criteria:

1. `database/schema.sql` exists.
2. `database/setup.js` exists.
3. `database/migrations.js` exists or equivalent migration support is available.
4. The setup script can initialize the local SQLite database.
5. The setup script uses the configured database path.
6. The setup script creates the database directory if it does not exist.
7. The schema includes an `admin_users` table.
8. The schema includes a `customer_accounts` table.
9. The schema includes a `package_purchases` table.
10. The schema includes a `delivery_history` table.
11. The schema includes an `admin_action_logs` table.
12. The schema enforces unique admin usernames.
13. The schema enforces unique customer phone values.
14. The schema enforces unique customer login identifiers.
15. The schema supports secure customer balance access tokens.
16. The schema enforces non-negative customer balances.
17. The schema limits package sizes to supported values.
18. The schema stores package amounts in `amount_paid_cents`.
19. The schema supports positive multi-cup delivery quantities.
20. The schema supports delivery void/cancel fields without deleting delivery records.
21. The schema includes foreign key relationships between customer, admin, purchase, and delivery records.
22. The schema includes indexes for common lookup and history queries.
23. The setup script can seed or confirm an initial admin user.
24. Database setup does not require external database infrastructure.

## Dependencies

Story 1.3 depends on the decision to use SQLite for the MVP. This dependency is central because the schema and setup process are SQLite-specific.

Story 1.3 depends on Story 1.2 because the setup script should use the configured database path rather than hardcoding the database location.

Story 1.3 depends on the application foundation from Story 1.1 because the database must support the Express app's later route and model behavior.

Story 1.3 also depends on the business decision that the product is a prepaid cup ledger. This determines which tables are needed: customers, purchases, deliveries, balances, admins, and action history.

Future stories depend heavily on Story 1.3:

- Owner authentication depends on `admin_users`.
- Customer management depends on `customer_accounts`.
- Package purchase recording depends on `package_purchases`.
- Delivery recording depends on `delivery_history`.
- Dashboard metrics depend on customer, package, and delivery data.
- Customer portal depends on customer account, balance, purchase history, and delivery history data.
- Shared QR/balance links depend on customer access tokens.
- Delivery voiding depends on voiding fields in delivery history.

## Risks

Risk: The schema could be too narrow and fail to support later MVP features.

Impact: Later stories would require disruptive schema changes.

Mitigation: Include the core ledger entities up front: admins, customers, packages, deliveries, and logs. Add migration support for later refinements.

Risk: The schema could be too broad and include unnecessary product concepts.

Impact: The MVP could become harder to understand and maintain.

Mitigation: Keep the schema focused on the delivered app's actual needs. Do not add loyalty, ordering, payment processing, multi-shop, or POS tables.

Risk: Data integrity constraints could be missing.

Impact: Invalid balances, unsupported package sizes, duplicate customers, or orphaned records could damage trust in the ledger.

Mitigation: Use unique constraints, check constraints, foreign keys, and indexes.

Risk: Database setup could require manual steps.

Impact: Local setup becomes fragile and inconsistent.

Mitigation: Provide `database/setup.js` and make it use the configured database path.

Risk: Future schema changes could require manual database resets.

Impact: Iterative implementation becomes slower and more error-prone.

Mitigation: Include migration support through `database/migrations.js`.

## Priority

Priority: High

Story 1.3 is high priority because the Owner MVP cannot reliably implement customer management, package purchases, delivery recording, or dashboard metrics without a database schema and setup process.

This story belongs early in Epic 1 because it turns the application from a runnable server into a persistent ledger foundation. It should be implemented before business workflows that create or mutate membership data.

## Success Metrics

Success metric 1: The database can be initialized locally with the setup script.

Success metric 2: The app can open the configured SQLite database after setup.

Success metric 3: Core tables exist for admins, customers, package purchases, delivery history, and action logs.

Success metric 4: Constraints prevent duplicate admin usernames, duplicate customer phone values, duplicate customer login identifiers, negative balances, invalid package sizes, and invalid delivery quantities.

Success metric 5: Foreign key relationships connect purchases and deliveries to the correct customers and admins.

Success metric 6: Later owner workflows can use the schema without replacing the database foundation.

Success metric 7: Later customer-facing workflows can read balances, package history, delivery history, and shared access tokens from the same schema.

Success metric 8: Automated tests can initialize or use SQLite databases consistently.

## Traceability To Completed Application

The completed application confirms that this story was delivered.

Delivered evidence:

- `database/schema.sql` defines the core schema.
- `database/setup.js` initializes the local SQLite database.
- `database/migrations.js` supports incremental schema changes.
- `database/database.js` opens SQLite and enables foreign keys.
- `admin_users` supports owner authentication.
- `customer_accounts` supports customer management, balances, login credentials, and balance access tokens.
- `package_purchases` supports package purchase history, fixed VND pricing through `amount_paid_cents`, bonus cups, and total credited cups.
- `delivery_history` supports multi-cup delivery, balance after delivery, notes, and void/cancel fields.
- `admin_action_logs` supports owner action history.

The final delivered app uses this schema for Phase 1 Owner MVP, Phase 2 Customer Portal, QR/shared balance access, delivery voiding, dashboard metrics, and automated tests.
