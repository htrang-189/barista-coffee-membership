# Story 1.2: Add Environment Configuration

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: Updated Plan

Workflow context: BMAD correct-course output

Status: Complete / Delivered

## Correct-Course Summary

Story 1.2 introduced centralized environment configuration for the Express and SQLite application. The main correction was to keep configuration intentionally simple and local-MVP focused instead of introducing heavier configuration management or scattering environment values across server, database, and model files.

The final delivered solution uses a root-level `config.js` module. It loads environment variables through `dotenv`, provides local development defaults, and exports the runtime values needed by the app: runtime environment, host, port, SQLite database path, session secret, and bcrypt rounds.

## Problem Discovered

The problem discovered was that the application foundation needed runtime configuration before later owner stories could safely proceed, but the original foundation assumptions did not need a complex configuration framework.

The app needed to answer several practical questions:

- Which host should the app bind to?
- Which port should the app use?
- Which SQLite database file should setup initialize?
- Which SQLite database file should the running app open?
- Which session secret should be used?
- How should production-aware cookie behavior be determined?
- How many bcrypt rounds should password hashing use?

If these answers were hardcoded in each file that needed them, later implementation would become fragile. If the solution used a heavy configuration system, the MVP would become more complex than necessary.

The problem was therefore a balance problem: the app needed real configuration discipline without overbuilding.

## Root Cause

The root cause was that foundation-level runtime settings are cross-cutting concerns. They affect multiple parts of the app at once:

- `server.js` needs host, port, runtime environment, database path, and session secret.
- `database/setup.js` needs the SQLite database path.
- `database/database.js` needs the SQLite database path.
- `models/password.js` needs bcrypt rounds.
- Tests need ways to use controlled database paths and session secrets.

Without a central module, these values would likely be duplicated or hardcoded. Duplication would create drift. Hardcoding would make local testing, future deployment, and maintenance harder.

The second root cause was the product's local-first MVP constraint. The app needed enough configuration to be maintainable, but it also needed local defaults so the owner/developer workflow remained simple.

## Decision Taken

The decision was to implement a simple root-level `config.js` module and use `dotenv` for environment-variable loading.

The delivered `config.js` exports:

- `nodeEnv`
- `port`
- `host`
- `databasePath`
- `sessionSecret`
- `bcryptRounds`

The decision also clarified the boundary of configuration:

- Runtime settings belong in `config.js`.
- Business rules do not belong in `config.js`.
- Package pricing, bonus cup rules, delivery validation, dashboard calculations, and customer access behavior stay in model and route logic.

This decision gave the app one source of truth for runtime settings while keeping the MVP lightweight.

## Updated Implementation Plan

The updated implementation plan was:

1. Create `config.js` at the project root.
2. Load environment variables through `dotenv`.
3. Define local defaults for development.
4. Export runtime environment, host, port, database path, session secret, and bcrypt rounds.
5. Update `server.js` to import and use `config.js`.
6. Update `database/setup.js` to use `config.databasePath`.
7. Update `database/database.js` to use `config.databasePath` by default.
8. Update password hashing behavior to use `config.bcryptRounds`.
9. Keep all business rules outside configuration.
10. Preserve local startup and test behavior.

The final delivered app follows this plan.

## Impact On Architecture

The architecture impact was positive and contained.

The story did not change the single-app Express architecture. It strengthened it by making app startup and runtime behavior configurable.

The story did not change the SQLite architecture. It strengthened it by giving setup and runtime database access the same configured database path.

The story did not create a new architectural layer. `config.js` is a lightweight support module, not a framework or service.

The story improved maintainability because server, database, and password helper code can import one configuration object instead of reading environment variables independently.

The story also improved testability. Tests can still pass explicit app options such as `databasePath`, `database`, or `sessionSecret`, while the normal app path uses central defaults.

## Impact On Future Stories

Story 1.2 directly supported future Phase 1 and Phase 2 stories.

Impact on owner authentication:

Admin login and route protection use session middleware. Session behavior depends on `config.sessionSecret` and production-aware cookie settings from `config.nodeEnv`.

Impact on password hashing:

Password hashing uses `config.bcryptRounds`. This supports admin user creation, customer account creation, customer login, and owner-managed customer password reset.

Impact on database setup:

Customer management, package purchases, deliveries, dashboard metrics, customer portal, and shared links all depend on the SQLite database. `config.databasePath` ensures setup and runtime agree on where that database lives.

Impact on tests:

The test suite can instantiate the app and supply test-specific values while the app's default configuration remains centralized.

Impact on production readiness:

The story creates a path for future environment-specific values without source-code changes. It does not complete production hardening, but it makes later hardening easier.

## Lessons From The Adjustment

The first lesson is that configuration should be centralized early. Even a small app quickly needs runtime settings in multiple places.

The second lesson is that configuration should remain lightweight for an MVP. The product did not need a complex environment management framework. A simple `config.js` module solved the problem cleanly.

The third lesson is that local defaults matter. The app's low-maintenance goal would be weakened if every local run required a complete `.env` file.

The fourth lesson is that development defaults must be clearly understood. A default session secret is useful locally but must not be treated as production-safe.

The fifth lesson is that business rules should not be placed in configuration. Runtime settings and product behavior are different concerns. Keeping them separate made later changes to package pricing, bonus rules, delivery behavior, and dashboard metrics easier to manage.

## Final Updated Plan Status

Updated plan status: Implemented / Delivered

The correction was successful. The current delivered app uses centralized environment configuration through `config.js`, and the approach supports the completed Owner MVP and Customer Portal without introducing unnecessary complexity.
