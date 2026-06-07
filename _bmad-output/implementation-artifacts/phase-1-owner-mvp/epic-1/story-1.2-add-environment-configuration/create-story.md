# Story 1.2: Add Environment Configuration

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: `story-[slug].md`

Workflow context: BMAD create-story output

Status: Reconstructed retrospective story document

## Story Title

Add Environment Configuration

## Business Context

The Barista Coffee Membership application is a small, owner-operated prepaid cup ledger for a single coffee shop. The Owner MVP must be easy to run locally, inexpensive to maintain, and reliable enough to become the operational source of truth for customer balances, package purchases, deliveries, and dashboard metrics.

Environment configuration is a foundational business requirement even though it is not directly visible to the owner. The app cannot reliably support owner workflows if runtime settings are hidden in source code or duplicated across files. The server needs to know which host and port to use. The database setup and runtime database helper need to use the same SQLite file path. Session middleware needs a configurable secret. Password hashing behavior needs configurable bcrypt rounds.

This story supports the phase goal by making the Owner MVP predictable and maintainable. It reduces setup risk, supports local development, and prepares the application for future deployment or test environments without changing application code.

## User Story

As the project team supporting the coffee shop owner,

I want the application to use centralized environment configuration,

So that the Owner MVP can run locally with sensible defaults, safely override runtime settings when needed, use the correct SQLite database path, configure sessions, and support authentication-related settings without hardcoded values scattered throughout the codebase.

## Acceptance Criteria

1. A root-level `config.js` file exists.
2. `config.js` loads environment variables through `dotenv`.
3. `config.js` exports the runtime environment value.
4. `config.js` exports the server host value.
5. `config.js` exports the server port value as a number.
6. `config.js` exports the SQLite database path.
7. `config.js` exports the session secret.
8. `config.js` exports bcrypt round configuration as a number.
9. `server.js` imports and uses the centralized configuration.
10. `server.js` uses the configured host and port for app startup.
11. `server.js` uses the configured runtime environment for production-aware session cookie behavior.
12. `server.js` uses the configured session secret for session middleware.
13. `database/setup.js` imports and uses the configured database path.
14. `database/database.js` imports and uses the configured database path when no explicit database path is supplied.
15. The application can run locally with development defaults.
16. Environment variables can override development defaults.
17. Configuration does not include package pricing, bonus cup rules, delivery rules, dashboard calculations, or other business rules.
18. Configuration values are not displayed in owner or customer UI.

## Functional Requirements

The application must provide one centralized configuration module at the project root.

The configuration module must load environment variables before constructing exported runtime settings.

The configuration module must define `nodeEnv`, defaulting to `development` when `NODE_ENV` is not provided.

The configuration module must define `port`, defaulting to `3000` when `PORT` is not provided.

The configuration module must define `host`, defaulting to `127.0.0.1` when `HOST` is not provided.

The configuration module must define `databasePath`, defaulting to the local SQLite database file under `database/app.db` when `DATABASE_PATH` is not provided.

The configuration module must define `sessionSecret`, defaulting to a development-only value when `SESSION_SECRET` is not provided.

The configuration module must define `bcryptRounds`, defaulting to an MVP-appropriate numeric value when `BCRYPT_ROUNDS` is not provided.

The server must consume configuration instead of reading environment values directly.

Database setup must consume configuration instead of hardcoding the database path.

Database connection helpers must consume configuration instead of hardcoding the database path.

## Non-Functional Requirements

The configuration implementation must be simple and maintainable. It should avoid a complex configuration framework because the MVP is a small single-shop application.

The configuration implementation must support local runnability. Missing production environment variables must not prevent the app from starting in local development.

The configuration implementation must support future environment overrides. Runtime values must be adjustable without source-code edits.

The configuration implementation must support testability. Tests should be able to create the app and, where needed, provide controlled database paths without fighting hardcoded values.

The configuration implementation must preserve separation of concerns. Runtime configuration must not become the place where business rules are stored.

The configuration implementation must be understandable to future maintainers. A developer should be able to open `config.js` and quickly understand the core runtime settings used by the app.

## UI Requirements

This story has no direct UI requirement.

No owner-facing screen should be added.

No customer-facing screen should be added.

No navigation item, dashboard card, form field, notification, QR section, balance display, package history, or delivery history should be added by this story.

Configuration values must not be rendered into HTML pages.

The indirect UI requirement is that the app should be able to start on the configured host and port so later UI pages can be viewed consistently.

## Database Requirements

The SQLite database path must be configurable through `DATABASE_PATH`.

The local default database path must point to the project database file used by the MVP.

Database setup must initialize the configured database path.

Database connection helpers must open the configured database path by default.

This story must not change the database schema.

This story must not create, edit, or delete business records.

This story must not modify customer balances, package purchases, delivery history, admin users, customer accounts, or access tokens.

## Technical Notes

The delivered application uses `config.js` at the project root.

The configuration module uses `dotenv` to load local environment variables.

The configuration object includes:

- `nodeEnv`
- `port`
- `host`
- `databasePath`
- `sessionSecret`
- `bcryptRounds`

`server.js` imports `config.js` and uses it for session configuration, app startup, and production-aware cookie behavior.

`database/setup.js` imports `config.js` and uses `config.databasePath` during local database initialization.

`database/database.js` imports `config.js` and uses `config.databasePath` when a database path is not passed explicitly.

The development default session secret is acceptable for local use only. Non-local environments must override it with `SESSION_SECRET`.

Bcrypt rounds are configuration because they affect password hashing cost, not product business behavior.

Business rules such as fixed VND pricing, bonus cup rules, delivery quantity validation, and voiding behavior must remain in model logic.

## Testing Requirements

Testing should confirm that the application still starts with local defaults.

Testing should confirm that the database setup script can initialize the configured database path.

Testing should confirm that the server uses centralized configuration rather than duplicating environment parsing.

Testing should confirm that database setup and database helper behavior use the same configured database path.

Testing should confirm that the app's existing test command remains available:

```sh
npm test
```

Direct browser UI testing is not required for this story because there is no direct UI change.

Business workflow tests are not required for this story specifically, but later workflow tests indirectly validate that the configuration layer supports the delivered app.

## Definition of Done

Story 1.2 is done when `config.js` exists and exports the required runtime values.

Story 1.2 is done when environment variables are loaded through `dotenv`.

Story 1.2 is done when development defaults allow the app to run locally.

Story 1.2 is done when `server.js` uses configuration for host, port, runtime environment, and session secret.

Story 1.2 is done when `database/setup.js` uses the configured database path.

Story 1.2 is done when `database/database.js` uses the configured database path by default.

Story 1.2 is done when bcrypt round configuration is available for password hashing utilities.

Story 1.2 is done when no business rules are placed in configuration.

Story 1.2 is done when the app can still be started, database setup can still run, and tests remain executable.

Story 1.2 is done when later owner authentication, customer management, package purchase, delivery, dashboard, and customer portal stories can rely on the centralized configuration layer.
