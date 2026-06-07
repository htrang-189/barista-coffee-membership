# Story 1.1: Express And SQLite Application Foundation

Workflow step: Amelia: investigate

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD investigation record generated after implementation

## 1. Investigation Purpose

The purpose of this investigation is to document the technical risks reviewed during delivery of Story 1.1, Express And SQLite Application Foundation, and explain how those risks were resolved or determined not to be blockers.

No major production-blocking foundation bug remains in the current delivered app. However, the foundation story carried several important risk areas: database startup, database connectivity, SQLite foreign key enforcement, app testability, route separation, and local runnability. Because this story became the base for the full Owner MVP and later Customer Portal, these risks needed to be investigated carefully.

This artifact is written in root cause analysis style. It uses the current implemented web app as source of truth and records why the delivered foundation is considered stable.

## 2. Trigger / Reason For Investigation

The investigation was triggered by the importance of the application foundation to the full product. Story 1.1 was the first implementation story, so any unresolved issue at this layer would affect every later story.

The most important concern was database startup and connectivity. The product is a ledger for prepaid cups. If the database cannot initialize, cannot enforce relationships, or cannot be opened reliably, the owner cannot trust customer balances, package purchases, or delivery history.

Another reason for investigation was the earlier possibility of heavier database infrastructure. If the MVP required PostgreSQL or another external database service, local setup would become more difficult. This would conflict with the product requirement that the app be low maintenance and easy to run locally.

The investigation also reviewed whether the Express app was structured in a testable and maintainable way. If the app could only be tested through a manually running server, later QA work would become fragile.

## 3. Symptoms Or Risk Area

Risk area 1: Local database initialization might fail.

The database file lives in the project database folder. If the directory does not exist, if schema execution fails, or if setup requires manual steps, the owner/developer workflow becomes unreliable.

Risk area 2: SQLite foreign keys might not be enforced.

SQLite supports foreign keys but requires them to be enabled. If foreign keys are not enabled, package purchases or deliveries could reference missing customers or admins, which would damage ledger integrity.

Risk area 3: The app could depend on external database infrastructure.

An external database dependency would increase setup and hosting burden for a small single-shop MVP.

Risk area 4: App startup could be hard to test.

If `server.js` only started a listener and did not export the app, automated tests would be harder to run reliably.

Risk area 5: Admin and customer routes could become mixed.

The final product uses owner/admin routes and customer routes. If the foundation does not separate route areas early, later authorization and UI behavior could become harder to maintain.

Risk area 6: Error handling could expose raw implementation details.

Unknown routes or server errors should not show confusing internal output to users.

## 4. Investigation Steps

Step 1: Review the actual application entry point.

`server.js` was reviewed to confirm that it creates the Express app, applies middleware, mounts routes, handles root navigation, exports `createApp()`, and only starts a network listener when executed directly.

Step 2: Review configuration handling.

`config.js` was reviewed to confirm that host, port, database path, session secret, runtime environment, and bcrypt rounds are centralized and environment-overridable.

Step 3: Review database setup.

`database/setup.js` was reviewed to confirm that it reads the schema file, creates the database directory, opens the configured SQLite database, executes schema SQL, runs migrations, and seeds or confirms the initial admin user.

Step 4: Review database connection helper.

`database/database.js` was reviewed to confirm that SQLite is opened through a shared helper and that `PRAGMA foreign_keys = ON` is executed.

Step 5: Review schema and relational constraints.

`database/schema.sql` was reviewed to confirm that tables, constraints, indexes, and foreign key relationships exist for the delivered app's data model.

Step 6: Review route mounting.

`server.js`, `routes/admin.js`, and `routes/customer.js` were reviewed to confirm that `/admin` and `/customer` route areas are mounted separately inside the same application.

Step 7: Review testability.

`package.json` and `server.js` were reviewed to confirm that `npm test` exists and that the app can be created through `createApp()`.

Step 8: Review delivered behavior.

The delivered app's later features were considered as evidence. Admin workflows, customer workflows, QR/shared links, dashboard metrics, and automated tests all run on the Story 1.1 foundation.

## 5. Findings

Finding 1: The app is locally runnable.

`package.json` provides `npm run dev`, and `server.js` starts the app on the configured host and port when executed directly.

Finding 2: Database setup is scripted.

`database/setup.js` initializes the SQLite database and avoids manual schema setup. It creates the directory for the configured database path, executes the schema, runs migrations, and handles initial admin setup.

Finding 3: SQLite foreign keys are enabled.

`database/database.js` runs `PRAGMA foreign_keys = ON` when opening the database. This directly addresses the relational integrity risk.

Finding 4: The app is testable.

`server.js` exports `createApp()`, which allows automated tests to instantiate the app without starting a separate server process.

Finding 5: Route separation is in place.

Admin routes are mounted under `/admin`, and customer routes are mounted under `/customer`. This supports the single-app architecture while keeping owner and customer concerns separated.

Finding 6: Error handling is present.

The app includes shared 404 and error handlers. This reduces the risk of raw server output appearing in the browser.

Finding 7: The foundation supported the completed app.

The current application includes the full Owner MVP and Customer Portal behavior on top of this foundation. That is strong evidence that the risks were resolved sufficiently for the MVP.

## 6. Root Cause

There was no single major defect that blocked Story 1.1. The root cause of the investigated risk was architectural fit: the foundation needed to match the business scale of the product.

The project could have become more complex than necessary if it assumed external database infrastructure, a separate frontend framework, or multiple application surfaces. That would have created setup risk and slowed delivery for a small shop membership ledger.

For the database startup concern, the root cause risk was that local database setup can fail when directory creation, schema execution, migrations, and connection behavior are not centralized. Without a setup script and shared database helper, later features would rely on inconsistent or manual setup.

For the data integrity concern, the root cause risk was SQLite's foreign key behavior. Foreign key enforcement is not useful unless it is enabled on the connection. The delivered helper addresses that directly.

For testability, the root cause risk was coupling app creation to server listening. Exporting `createApp()` resolved this.

## 7. Resolution

The risks were resolved through the delivered Express and SQLite foundation.

Resolution for local runnability:

- `package.json` defines `npm run dev`.
- `server.js` starts the app using `config.host` and `config.port`.

Resolution for database setup:

- `database/setup.js` initializes the SQLite database.
- `config.js` defines the database path.
- `database/schema.sql` defines the schema.
- `database/migrations.js` applies incremental changes.

Resolution for database connectivity and integrity:

- `database/database.js` opens SQLite.
- `database/database.js` enables foreign keys.
- Schema constraints and indexes support reliable ledger behavior.

Resolution for route separation:

- Admin routes are mounted under `/admin`.
- Customer routes are mounted under `/customer`.
- The app remains one Express application rather than separate apps.

Resolution for testability:

- `server.js` exports `createApp()`.
- `package.json` defines `npm test`.

Resolution for user-facing error states:

- Shared 404 and error views are returned for unknown routes and unhandled errors.

## 8. Prevention Notes

Future implementation should keep database setup scripted. Manual database setup should not become part of the normal workflow.

Future implementation should keep the database path configurable through `config.js` and environment variables.

Future implementation should preserve foreign key enforcement in SQLite connections.

Future implementation should keep business logic in model modules rather than browser JavaScript or views.

Future implementation should preserve the `createApp()` export so tests remain stable and easy to run.

Future implementation should keep admin and customer route areas separate, even though they share one Express application.

Future production deployment planning should include session-secret configuration, SQLite backup strategy, and hosting-specific secure cookie settings.

If PostgreSQL migration is ever introduced, the existing route/model/database separation should be preserved so migration work remains contained.

## 9. Related Files

Related foundation files:

- `server.js`
- `package.json`
- `config.js`
- `database/schema.sql`
- `database/setup.js`
- `database/database.js`
- `database/migrations.js`
- `routes/admin.js`
- `routes/customer.js`
- `views/shared/404.html`
- `views/shared/error.html`
- `public/css/styles.css`
- `public/js/admin.js`
- `models/`
- `middleware/`
- `views/`
- `public/`

Related evidence from the current app:

- Admin portal under `/admin/*`.
- Customer portal under `/customer/*`.
- SQLite database at the configured database path.
- Automated tests run through `npm test`.
- Static assets served from `public/`.

## 10. Final Investigation Status

Final investigation status: Closed / Not Blocking

No unresolved foundation issue blocks Story 1.1 or the completed web application.

The investigated risks were either resolved through the delivered implementation or confirmed to be acceptable for the MVP. The Express and SQLite foundation is stable enough for the delivered Owner MVP, Customer Portal, QR/shared link access, and current automated test suite.
