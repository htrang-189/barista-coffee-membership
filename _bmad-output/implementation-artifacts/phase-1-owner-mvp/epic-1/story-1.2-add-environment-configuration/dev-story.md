# Story 1.2: Add Environment Configuration

Phase: Phase 1: Owner MVP

Epic: Epic 1: Application Foundation

Output type: CODE

Workflow context: BMAD dev-story output

Status: Implemented / Delivered

## Implementation Evidence Summary

Story 1.2 delivered centralized environment configuration for the Barista Coffee Membership web application. This is implementation evidence, not a planning document. The current completed application is the source of truth.

The implementation gives the Express and SQLite app one place to read runtime configuration. This matters because the Owner MVP must be easy to run locally and maintain over time. The shop owner does not directly interact with configuration, but every business workflow depends on it: the app must start on the expected host and port, use the correct SQLite database file, configure sessions safely, and provide password hashing settings for authentication features.

## Files Created

### `config.js`

Why it exists:

`config.js` exists to centralize runtime configuration for the application. Before this story, runtime values could have been hardcoded directly in server, database, or model files. That would make the app harder to maintain and harder to adapt for local testing or future deployment.

What problem it solves:

It solves configuration drift. Server startup, database setup, database access, session middleware, and password hashing all need runtime settings. If each module reads environment variables differently, the app can become inconsistent. A centralized file keeps those values visible and reusable.

How it works:

`config.js` loads environment variables through `dotenv` and exports a configuration object:

```js
const path = require('path');

require('dotenv').config();

const projectRoot = __dirname;

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  host: process.env.HOST || '127.0.0.1',
  databasePath: process.env.DATABASE_PATH || path.join(projectRoot, 'database', 'app.db'),
  sessionSecret: process.env.SESSION_SECRET || 'development-session-secret-change-me',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12)
};
```

The exported values are consumed by the delivered app in server startup, session setup, database setup, database connection helpers, and password hashing.

## Files Modified

### `package.json`

Why it exists in this story:

`package.json` records the runtime dependency needed for environment configuration.

What problem it solves:

It ensures the project can load local `.env` values consistently through the `dotenv` package. This supports local development and future environment overrides without editing source code.

How it works:

The delivered `package.json` includes:

```json
"dotenv": "^16.4.7"
```

The app then calls `require('dotenv').config()` inside `config.js`.

### `package-lock.json`

Why it exists in this story:

`package-lock.json` captures the resolved dependency tree after adding or maintaining the `dotenv` dependency.

What problem it solves:

It makes dependency installation reproducible. This matters for a low-maintenance MVP because the app should install and run predictably across local environments.

How it works:

The lock file records the exact dependency graph used by npm.

### `server.js`

Why it was modified:

`server.js` needs configuration for database path, runtime environment, session secret, host, and port.

What problem it solves:

It removes hardcoded startup and session values from the server entry point. This allows the app to run locally with defaults while still supporting environment overrides.

How it works:

`server.js` imports configuration:

```js
const config = require('./config');
```

The app uses `config.databasePath` when opening the database unless a test passes a specific database path:

```js
const database = appOptions.database || openDatabase(appOptions.databasePath || config.databasePath);
```

The app uses `config.nodeEnv` to determine production-aware cookie behavior:

```js
const isProduction = config.nodeEnv === 'production';
```

The app uses the configured session secret unless a test-specific secret is supplied:

```js
secret: appOptions.sessionSecret || config.sessionSecret
```

The server uses configured host and port when started directly:

```js
const port = config.port;
const host = config.host;
```

### `database/setup.js`

Why it was modified:

The database setup script needs to initialize the same database path the app will use at runtime.

What problem it solves:

It prevents setup/runtime path mismatch. Without centralized configuration, setup could initialize one SQLite file while the running app opens another.

How it works:

`database/setup.js` imports `config.js` and uses `config.databasePath` to create the database directory, open the database, and report initialization:

```js
fs.mkdirSync(path.dirname(config.databasePath), { recursive: true });

const database = openDatabase(config.databasePath);
```

### `database/database.js`

Why it was modified:

The database helper needs a default database path for runtime connections.

What problem it solves:

It keeps database opening behavior consistent across the app. Callers can still pass an explicit database path for tests, but the application default comes from configuration.

How it works:

`database/database.js` imports configuration and resolves the database path:

```js
const resolvedDatabasePath = databasePath || config.databasePath;
```

It then opens SQLite at the resolved path and enables foreign key enforcement.

### `models/password.js`

Why it was modified:

Password hashing needs a configurable cost setting.

What problem it solves:

It prevents bcrypt rounds from being hardcoded in password logic. This allows the application to adjust hashing cost through configuration without editing the password helper.

How it works:

`models/password.js` imports `config.js` and uses `config.bcryptRounds`:

```js
return bcrypt.hash(password, config.bcryptRounds);
```

## Database Changes

No database schema changes were introduced by Story 1.2.

Why:

Environment configuration controls where the SQLite database is located. It does not define new tables, columns, indexes, or records.

What problem this avoids:

It keeps the story properly scoped. Schema changes belong to database setup and migration stories, while environment configuration belongs to runtime setup.

Delivered database impact:

- `DATABASE_PATH` can override the default SQLite file location.
- `config.databasePath` defaults to `database/app.db`.
- `database/setup.js` initializes the configured database path.
- `database/database.js` opens the configured database path by default.

## Routes Added

No routes were added by Story 1.2.

Why:

Environment configuration is infrastructure behavior, not a user-facing route.

What problem this avoids:

It avoids exposing internal runtime values through HTTP pages or endpoints. Configuration values such as session secret and database path should never be shown in the UI.

Delivered route impact:

Existing routes benefit indirectly because `server.js` starts using configured host, port, runtime environment, and session secret. Admin and customer route behavior remains unchanged.

## Models Added

No new business model was added by Story 1.2.

Why:

The story does not create a new domain concept. It introduces runtime configuration.

What problem this avoids:

It prevents configuration from being treated as business data. Runtime settings are infrastructure concerns, not membership ledger entities.

Delivered model impact:

The existing password helper uses `config.bcryptRounds`, which is a configuration integration rather than a new business model.

## UI Components Added

No UI components were added by Story 1.2.

Why:

Owners and customers do not need to view environment configuration.

What problem this avoids:

It prevents sensitive configuration values from being exposed in rendered pages. It also keeps the story focused on foundation behavior instead of visible workflow changes.

Delivered UI impact:

The UI benefits indirectly because the configured host and port allow the web app to start predictably, and the configured database path allows pages to render persisted data once later stories add owner and customer workflows.

## Business Logic Implemented

Story 1.2 implemented no membership business rules.

Why:

Environment configuration should not contain pricing, bonus, delivery, balance, dashboard, or customer-access rules. Those belong in model logic.

What problem this solves:

It preserves separation of concerns. The app can change runtime settings without changing product behavior, and it can change product behavior without treating config as a business-rule store.

Delivered business-rule boundaries:

- Fixed cup price remains outside `config.js`.
- Bonus rules remain outside `config.js`.
- Delivery validation remains outside `config.js`.
- Dashboard calculations remain outside `config.js`.
- Authentication workflows use configuration but are implemented in route/model logic.

## Validation Rules

### Numeric conversion for `PORT`

Why it exists:

The Express server expects a numeric port value for startup.

What problem it solves:

Environment variables are strings by default. Converting `PORT` to a number prevents downstream ambiguity.

How it works:

```js
port: Number(process.env.PORT || 3000)
```

### Numeric conversion for `BCRYPT_ROUNDS`

Why it exists:

Bcrypt hashing expects a numeric cost value.

What problem it solves:

It ensures the password helper receives a number rather than a string.

How it works:

```js
bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12)
```

### Development defaults

Why they exist:

The MVP must be easy to run locally.

What problem they solve:

The app can start without a production `.env` file, reducing setup friction.

How they work:

Each value uses an environment variable first and falls back to a local default.

## Security Controls

### Configurable session secret

Why it exists:

Session security depends on a secret value that should not be hardcoded for non-local environments.

What problem it solves:

It allows deployments to override the development default with a secure value.

How it works:

`config.sessionSecret` reads `SESSION_SECRET` or falls back to a development-only value.

### Production-aware secure cookie behavior

Why it exists:

Session cookies should use `secure` behavior in production.

What problem it solves:

It supports safer session handling when the app is deployed with HTTPS.

How it works:

`server.js` checks:

```js
const isProduction = config.nodeEnv === 'production';
```

The session cookie uses:

```js
secure: isProduction
```

### Configurable bcrypt rounds

Why it exists:

Password hashing cost should be adjustable without code changes.

What problem it solves:

It allows the app to tune password hashing behavior while keeping the password helper simple.

How it works:

`models/password.js` uses `config.bcryptRounds` when hashing passwords.

### No UI exposure of configuration

Why it exists:

Configuration values can include sensitive data such as session secrets and database paths.

What problem it solves:

It prevents leaking internal runtime details to owners, customers, or shared-link users.

How it works:

No route or view renders `config.js` values.

## Test Coverage

Story 1.2 is covered indirectly by the completed application's automated tests.

Why indirect coverage is acceptable:

Environment configuration is not a business workflow with its own route. Its correctness is proven by app startup, route tests, database setup behavior, authentication behavior, password hashing behavior, and test-specific configuration overrides.

Evidence from current tests:

- Tests instantiate the app with `createApp()`.
- Tests pass explicit `sessionSecret` values for isolated test sessions.
- Tests pass explicit database paths or database objects for isolated SQLite test databases.
- Admin authentication tests depend on session configuration.
- Customer portal tests depend on session configuration.
- Password reset tests depend on password hashing configuration.
- Owner/customer workflow tests depend on database configuration and app startup behavior.

Relevant test files:

- `tests/admin-auth.test.js`
- `tests/customer-portal.test.js`
- `tests/phase1-owner.test.js`
- `tests/e2e-owner-customer-flow.test.js`

Current delivered test command:

```sh
npm test
```

Current QA evidence:

The completed application has 30 passing automated tests. Those tests validate that the configuration layer supports the delivered app behavior.

## Final Delivered Implementation Result

Story 1.2 delivered a centralized runtime configuration layer for the Express and SQLite app.

The implementation exists because the Owner MVP needs reliable local startup, consistent database path handling, session configuration, and password hashing configuration. It solves hardcoded-setting risk by placing runtime values in `config.js`. It works by loading environment variables through `dotenv`, applying development defaults, and exporting a configuration object used by server, database, and password helper code.

No routes, UI components, database schema changes, or membership business rules were added by this story. That is the correct outcome. The story delivered infrastructure configuration and preserved clean separation between runtime settings and product behavior.
