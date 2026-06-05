# Story 1.2: Add Environment Configuration

Workflow step: John: create-epics-and-stories

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD documentation artifact generated after implementation

## 1. Phase Context

Phase 1 Owner MVP is focused on giving the coffee shop owner a working internal system for operating the prepaid cup membership program. The owner must be able to log in, manage customers, record package purchases, apply package credit rules, track balances, record deliveries, correct delivery mistakes, and review basic dashboard metrics.

For that phase goal to be practical, the application needs predictable configuration. The same codebase should be able to run locally during development and support later deployment settings without editing source code for every environment. Configuration affects the app's host, port, database path, session secret, runtime mode, and password hashing settings. These are foundational concerns because every owner workflow depends on a correctly configured server and database.

Story 1.2 supports Phase 1 by making the application easier to run, test, and maintain. Without environment configuration, the owner MVP would be tied to hardcoded values. That would increase setup risk and make later operational changes more fragile.

## 2. Epic Context

Epic 1: Application Foundation establishes the technical base for the Owner MVP. Story 1.1 scaffolds the Express and SQLite application. Story 1.2 adds the environment configuration needed to make that scaffold adaptable and reliable.

Environment configuration is part of the application foundation because it controls how the app behaves before any owner workflow is executed. The server must know which host and port to use. The database layer must know where the SQLite database file lives. Session middleware must know which secret to use. Password hashing utilities must know how many bcrypt rounds to apply. These are cross-cutting settings, so they belong in a centralized configuration layer rather than being scattered through routes or models.

In the delivered web app, this epic now supports the full application. The same configuration file is used by server startup, database setup, database connections, session handling, and password hashing behavior.

## 3. Story Identification

Story number: Story 1.2

Story title: Add Environment Configuration

Phase folder: `phase-1-owner-mvp`

Epic folder: `epic-1-application-foundation`

Workflow step: `create-epics-and-stories`

Primary actor: Coffee shop owner, represented indirectly through the need for a reliable app that can run locally and be configured without code edits.

Implementation status: Delivered in the current web application.

## 4. Business Problem

The business problem is that the owner MVP must be easy to run and maintain, but hardcoded application settings make that difficult. A small coffee shop should not need a developer to edit source files just to change a port, database location, session secret, or local setup behavior.

The product is intended to be low maintenance. If configuration values are embedded throughout the codebase, the application becomes fragile. A local development setup might work, but later testing or deployment could fail because settings cannot be changed cleanly. This would undermine confidence in the app before the owner even uses the business workflows.

Environment configuration also affects data safety and security. The SQLite database path determines where business records are stored. The session secret protects authenticated sessions. Bcrypt round settings affect password hashing cost. These values should be controlled deliberately rather than hidden in unrelated implementation files.

Story 1.2 solves this by introducing centralized configuration that supports the owner's need for a dependable application foundation.

## 5. User Need

The owner needs the application to run predictably without complex setup. The owner may not interact directly with configuration files, but the owner is affected by them. If the app starts on the wrong port, cannot find the database, or uses unsafe session settings, the owner workflow fails.

The implementation team also needs a clear configuration pattern. Developers and maintainers need to know where runtime settings live and how to override them. This prevents later stories from hardcoding environment-specific values in routes, models, database scripts, or tests.

The user need can therefore be stated as operational reliability. The app should behave consistently in local development and remain configurable for future environments without changing business logic.

## 6. Story Statement

As the project team building the Owner MVP,

we need centralized environment configuration for the Express and SQLite application,

so that the app can run locally, initialize the correct database, configure sessions safely, support password hashing settings, and prepare for future environment-specific changes without modifying application code.

## 7. Functional Scope

The functional scope of Story 1.2 is to add environment-aware configuration to the application foundation.

The story includes creating a central configuration module. In the delivered app, this is `config.js`. It reads environment variables through `dotenv` and provides local defaults for development.

The story includes configuration for the runtime environment. The delivered app supports `NODE_ENV`, which controls whether production-specific behavior such as secure session cookies should apply.

The story includes configuration for server host and port. The delivered app reads `HOST` and `PORT`, with defaults that support local development.

The story includes configuration for the SQLite database path. The delivered app reads `DATABASE_PATH`, with a default local database path of `database/app.db`.

The story includes configuration for session behavior. The delivered app reads `SESSION_SECRET`, with a development default that is suitable only for local use and should be replaced outside local development.

The story includes configuration for password hashing cost. The delivered app reads `BCRYPT_ROUNDS`, with a default value used by password hashing utilities.

The story includes loading environment variables through `dotenv` so local `.env` values can override defaults.

## 8. Out of Scope

This story does not implement admin login or password hashing behavior itself. It only provides configuration values used by those later features.

This story does not implement customer authentication, customer portal behavior, QR/shared access tokens, delivery recording, package purchase logic, dashboard metrics, or VND formatting.

This story does not require production deployment automation. It prepares configuration for different environments, but it does not define hosting, process management, backup strategy, or deployment pipelines.

This story does not require changing business rules. Package pricing, bonus cup rules, delivery quantities, balance calculations, and voiding behavior are outside the scope of environment configuration.

This story does not require exposing configuration values in the UI. Configuration is an application runtime concern, not an owner-facing screen.

## 9. Acceptance Criteria

Acceptance criteria:

- A central configuration module exists.
- Configuration values can be read from environment variables.
- Local development defaults exist for host and port.
- The SQLite database path is configurable.
- The session secret is configurable.
- Password hashing rounds are configurable.
- Runtime environment is configurable.
- Configuration is imported by server and database setup code instead of duplicating environment parsing.
- The app can still run locally without requiring a production `.env` file.
- Sensitive local values such as session secret can be overridden outside source code.
- Configuration does not introduce new business logic.

## 10. Dependencies

Story 1.2 depends on the application foundation direction from Story 1.1. It assumes there is an Express app that needs host, port, session, and database configuration.

The story depends on `dotenv` so environment variables can be loaded from local configuration files when needed.

The story depends on the decision to use SQLite for the MVP. Because SQLite stores data in a file path, that path must be configurable.

Later stories depend on Story 1.2. Admin authentication depends on session configuration and password hashing configuration. Database setup depends on the configured database path. Customer authentication and owner-managed password reset depend on password hashing settings. Tests depend on being able to instantiate the app and, when needed, use controlled configuration values.

## 11. Expected Output

The expected output is a centralized environment configuration file that can be imported wherever runtime settings are needed.

Expected delivered configuration includes:

- Runtime environment.
- Server host.
- Server port.
- SQLite database path.
- Session secret.
- Bcrypt rounds.

Expected delivered file:

- `config.js`

Expected supporting behavior:

- `dotenv` is loaded.
- Server startup uses configured host and port.
- Database setup and database opening use the configured database path.
- Session middleware uses the configured session secret.
- Password hashing utilities can use configured bcrypt rounds.

The expected business outcome is reduced setup and maintenance risk. The app becomes easier to run locally and safer to adapt for future environments.

## 12. Traceability to Delivered Web App

The current delivered web app confirms that Story 1.2 was implemented.

Traceability evidence:

- `config.js` exists at the project root.
- `config.js` loads `dotenv`.
- `config.js` defines `nodeEnv`, `port`, `host`, `databasePath`, `sessionSecret`, and `bcryptRounds`.
- `server.js` imports `config.js`.
- `server.js` uses configured host and port for local startup.
- `server.js` uses the configured session secret in session middleware.
- `server.js` uses runtime environment to determine secure cookie behavior.
- `database/setup.js` imports `config.js` and uses the configured database path.
- `database/database.js` imports `config.js` and uses the configured database path when one is not passed directly.
- Password hashing behavior can use the configured bcrypt round setting.

This configuration layer now supports the delivered owner/admin portal, customer portal, QR/shared balance access, SQLite database setup, and automated tests. It remains a foundational part of the completed web application.
