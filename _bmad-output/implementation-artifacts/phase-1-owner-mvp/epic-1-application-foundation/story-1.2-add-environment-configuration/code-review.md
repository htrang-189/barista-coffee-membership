# Story 1.2: Add Environment Configuration

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: Approve

Workflow context: BMAD code-review output

Status: Reviewed

## Review Scope

This code review evaluates the implemented Story 1.2: Add Environment Configuration. The review uses the completed application as the source of truth and focuses on the delivered configuration layer and its integrations.

Reviewed implementation areas:

- `config.js`
- `server.js`
- `database/setup.js`
- `database/database.js`
- `models/password.js`
- `package.json`
- Current automated tests that exercise configuration-dependent behavior

The purpose of the story was to centralize runtime configuration so the Owner MVP can run locally, use the correct SQLite database path, configure sessions, and support password hashing settings without hardcoded values scattered throughout the application.

## Architecture Compliance

The implementation complies with the approved application architecture.

The app is a single Express web application backed by SQLite. A root-level `config.js` file is appropriate for this architecture because it gives server, database, and model modules a shared source of runtime settings.

The implementation correctly avoids creating a separate configuration subsystem or framework. That matters because the MVP is intentionally small and low maintenance. The solution uses `dotenv` and a plain CommonJS module, which is consistent with the rest of the codebase.

The configuration layer supports the single-app route architecture. `server.js` uses the configured host, port, environment, database path, and session secret while preserving route separation for `/admin/*` and `/customer/*`.

Finding: Architecture compliance is strong. The implementation keeps configuration centralized without overengineering.

## Coding Standards

The implementation follows the codebase's existing CommonJS style.

`config.js` is concise and readable. It imports `path`, loads environment variables through `dotenv`, defines `projectRoot`, creates a configuration object, and exports that object.

The naming is clear:

- `nodeEnv`
- `port`
- `host`
- `databasePath`
- `sessionSecret`
- `bcryptRounds`

These names are understandable and map directly to their use in the app.

The implementation uses numeric conversion for `PORT` and `BCRYPT_ROUNDS`, which is appropriate because environment variables are string values by default.

Finding: Coding standards are met. The implementation is simple, readable, and consistent with the project.

## Security Review

The story improves the security baseline by centralizing session and password-hashing configuration.

`server.js` uses `config.sessionSecret` for session middleware. This prevents the session secret from being embedded directly in server setup code and allows non-local environments to override it.

`server.js` derives production-aware cookie behavior from `config.nodeEnv`. This supports secure cookies when the app runs in production mode.

`models/password.js` uses `config.bcryptRounds`, allowing password hashing cost to be adjusted without changing password logic.

The development default session secret is a known limitation, but it is acceptable for local MVP use as long as deployment documentation continues to require `SESSION_SECRET` outside development.

No configuration values are exposed through routes or rendered UI.

Finding: Security implementation is acceptable for the MVP. The main recommendation is to keep production setup documentation explicit about overriding `SESSION_SECRET`.

## Validation Review

The implementation includes basic type normalization by converting `PORT` and `BCRYPT_ROUNDS` to numbers.

This is appropriate for the current MVP. It ensures Express receives a numeric port and bcrypt receives a numeric round count.

The implementation does not include strict validation for invalid numeric values such as `PORT=abc` or `BCRYPT_ROUNDS=abc`. That is not a blocker for the current story because the MVP uses sensible defaults and local setup, but stricter validation would be useful in a future production-readiness pass.

Finding: Validation is sufficient for MVP foundation use, with a future recommendation to add stricter environment validation for production.

## Database Integrity Review

The configuration layer supports database integrity by centralizing the SQLite database path.

`database/setup.js` uses `config.databasePath` to create the database directory and initialize the database. `database/database.js` also uses `config.databasePath` when no explicit path is supplied.

This consistency matters because setup and runtime must point to the same SQLite database file. If they diverge, the app could initialize one database and read from another.

The story does not modify schema, tables, constraints, or records. That is correct. Environment configuration should control where data lives, not what the data model contains.

Finding: Database integrity impact is positive. The implementation reduces database-path mismatch risk.

## Error Handling Review

The configuration story does not introduce new route-level error handling.

`database/database.js` already logs SQLite open and query failures. `database/setup.js` logs setup failures and sets `process.exitCode` when initialization fails. These behaviors use the configured database path, which makes failure messages more useful.

The implementation does not validate missing or invalid environment variables with explicit startup errors. For the local MVP, this is acceptable because defaults exist. For future production readiness, explicit validation could help catch misconfiguration earlier.

Finding: Error handling is acceptable for MVP. Future hardening should include clearer startup validation for invalid environment values.

## UI Consistency Review

Story 1.2 has no direct UI output. No pages, forms, dashboard components, customer portal elements, QR controls, or notification elements were added.

This is correct. Configuration values should not be shown to owners or customers.

The story indirectly supports UI consistency by making the app start on a configured host and port and connect to the configured database, allowing later UI pages to render consistently.

Finding: UI consistency is maintained. No unnecessary UI was introduced.

## Test Coverage Review

The story is covered indirectly through the current test suite.

Configuration-dependent behavior is exercised because tests instantiate the app, pass test session secrets, use isolated database paths or database objects, run route workflows, and rely on password hashing behavior.

Evidence from current tests:

- `tests/admin-auth.test.js` uses `createApp()` with a test session secret and test database setup.
- `tests/customer-portal.test.js` uses test database paths and session secrets.
- `tests/phase1-owner.test.js` exercises owner workflows on configured app instances.
- `tests/e2e-owner-customer-flow.test.js` exercises owner and customer flows through the app foundation.

There is no dedicated unit test for `config.js` itself. This is acceptable for the MVP because configuration behavior is simple and covered through integration behavior. A future production-hardening pass could add direct tests for environment override behavior.

Finding: Test coverage is acceptable. Direct config override tests are recommended but not required for approval.

## Findings

1. `config.js` correctly centralizes runtime configuration.
2. `dotenv` is loaded in the configuration module.
3. Server startup uses configured host and port.
4. Session middleware uses configured session secret.
5. Production-aware secure cookie behavior uses configured runtime environment.
6. Database setup uses configured database path.
7. Database helper uses configured database path by default.
8. Password hashing uses configured bcrypt rounds.
9. No UI exposure of configuration values was introduced.
10. No business rules were incorrectly moved into configuration.

## Issues

No critical issues found.

No high-priority issues found.

Medium issue: The development default session secret must not be used outside local development.

Medium issue: Invalid numeric environment values are not explicitly rejected at startup.

Low issue: There is no dedicated unit test for environment override behavior in `config.js`.

## Recommendations

1. Keep deployment/setup documentation explicit that `SESSION_SECRET` must be set outside local development.
2. Consider adding future environment validation for `PORT`, `BCRYPT_ROUNDS`, and `SESSION_SECRET` in a production-readiness phase.
3. Consider adding direct tests for config defaults and environment overrides if configuration complexity grows.
4. Continue keeping product business rules out of `config.js`.
5. Continue using `config.databasePath` consistently for setup and runtime database access.

## Approval Decision

The implemented Story 1.2 meets the expectations for the Owner MVP foundation. The configuration layer is simple, maintainable, architecturally aligned, secure enough for MVP use, and successfully supports the completed application.

The identified issues are not blockers. They are future hardening recommendations rather than reasons to reject the implementation.

## APPROVED
