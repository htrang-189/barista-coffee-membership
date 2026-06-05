# Story 1.1: Express And SQLite Application Foundation

Workflow step: Amelia: create-story

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD story specification generated after implementation

## 1. Story Title

Express And SQLite Application Foundation

This story defines the formal implementation specification for the first foundation story in Phase 1 Owner MVP. It establishes the single Express web application and SQLite-backed local persistence foundation used by the delivered Barista Coffee Membership application.

## 2. User Story

As the coffee shop owner,

I want the membership application to have a simple, locally runnable Express and SQLite foundation,

So that the shop can begin replacing paper or spreadsheet-based prepaid cup tracking with a reliable web application that supports future owner workflows such as admin login, customer management, package purchases, balance tracking, delivery recording, and dashboard metrics.

## 3. Business Context

The Barista Coffee Membership application is an operational tool for a small coffee shop. The business need is to track prepaid cups accurately without introducing the complexity of a loyalty platform, payment system, ordering system, or multi-shop product. The owner needs a dependable internal ledger before customers can safely view balances or history.

Story 1.1 is the first implementation story because the product cannot deliver owner value without a working application foundation. Later workflows all depend on a server, local database, route structure, view structure, static assets, and testable app lifecycle. If this foundation is weak, later features may work in isolation but fail as a coherent product.

The story is also important because the MVP must remain low maintenance. A small shop with a small membership base should not need to provision external database infrastructure just to run the product locally. The delivered application therefore uses Express for the web server and SQLite for local persistence. This combination supports the operational needs of the MVP while keeping setup practical.

In the delivered web app, this story became the base for both Phase 1 Owner MVP and Phase 2 Customer Portal behavior. The same application foundation now supports `/admin/*` owner routes, `/customer/*` customer routes, shared balance-link routes, server-rendered views, public CSS and JavaScript, session middleware, SQLite database setup, and automated tests.

## 4. Functional Requirements

The application must provide a single Express web server as the main runtime for the membership app.

The application must provide a main server entry point in `server.js`.

The application must expose a testable app creation function so automated tests can instantiate the app without requiring a manually started server process.

The application must support local startup through an npm script.

The application must serve static assets from the `public/` directory.

The application must parse standard form submissions because the Owner MVP uses server-rendered forms for workflows such as login, customer creation, package purchases, deliveries, and password reset.

The application must parse JSON request bodies where route behavior or future tests need JSON support.

The application must support session middleware so later owner and customer authentication stories can store authenticated user state.

The application must mount owner/admin routes under `/admin`.

The application must support customer route mounting under `/customer` as part of the single-app architecture, while customer-facing functionality remains outside the scope of Story 1.1.

The root route must direct users into the admin application flow.

The application must include shared 404 handling for unknown routes.

The application must include shared error handling for unhandled server errors.

The project must include a local database setup path.

The project must include a reusable database helper for SQLite access.

The project must include a folder structure that separates routes, models, middleware, views, static assets, and database files.

The project must include a test command that later stories can use for automated validation.

## 5. Non-Functional Requirements

The foundation must be low maintenance. It should avoid unnecessary external services and avoid infrastructure that is disproportionate to a single-shop MVP.

The foundation must be easy to run locally. A developer or owner-supporting maintainer should be able to start the app with a documented npm command and initialize the database with a documented npm command.

The foundation must be understandable. The app should use clear file names and responsibility boundaries so later work can be implemented without searching through a large or confusing codebase.

The foundation must be extensible enough for later Phase 1 and Phase 2 features. It should not hardcode assumptions that prevent customer routes, shared balance links, dashboard metrics, delivery voiding, or future reporting improvements.

The foundation must be testable. The app should be constructible from code through `createApp()` and should not require tests to depend on an already running server.

The foundation must preserve data integrity. SQLite foreign keys should be enabled, and schema setup should include constraints that support reliable ledger behavior.

The foundation must avoid premature complexity. It should not introduce a separate frontend build system, separate admin app, separate customer app, external database server, payment integration, or loyalty platform infrastructure.

## 6. UI Requirements

Story 1.1 must establish the server-rendered view structure used by the application.

The app must include a `views/` folder for HTML views.

The app must include shared views for common application states, including not-found and server-error states.

The app must include a `public/` folder for CSS and browser JavaScript assets.

Static CSS must be served in a way that later admin and customer screens can share the Barista visual language.

Static browser JavaScript must be served in a way that later owner UI enhancements can be added without changing the backend architecture.

This story does not require final dashboard UI, customer detail UI, package purchase UI, delivery UI, QR UI, customer portal UI, notification UI, or responsive polish. It must create the structure those UI elements can later use.

## 7. Data Requirements

The app must use SQLite for local MVP persistence.

The project must include a `database/` folder.

The project must include `database/schema.sql` for schema definition.

The project must include `database/setup.js` for local database initialization.

The project must include `database/database.js` for opening the database and providing reusable query helpers.

The database helper must enable SQLite foreign key enforcement.

The project must include migration support through `database/migrations.js` or equivalent migration handling so later schema changes can be applied without replacing the foundation.

The foundation must support future relational data requirements for admin users, customer accounts, package purchases, delivery history, and action logging.

The foundation must not rely on external database infrastructure for the MVP.

## 8. Security / Access Requirements

The foundation must support session-based authentication for later owner and customer login stories.

Session cookies must use a reasonable MVP security baseline, including `httpOnly` and `sameSite` settings.

The app must support a configurable session secret.

The foundation must support route separation between admin and customer areas.

The foundation must not expose raw server errors directly to users.

The foundation must provide shared error handling and not-found handling.

The foundation must prepare for CSRF-aware form workflows through middleware support.

This story does not implement full admin authorization, customer authorization, password hashing, customer password reset, or token-based shared access. It must create the server and middleware structure that makes those later security stories possible.

## 9. Acceptance Criteria

The story is accepted when the Express and SQLite foundation exists and can support later Owner MVP implementation.

Acceptance criteria:

- `server.js` exists and creates the Express app.
- `server.js` exports `createApp()` for automated tests.
- The app starts locally with `npm run dev`.
- `package.json` defines a local development script.
- `package.json` defines a database setup script.
- `package.json` defines a test script.
- `config.js` centralizes runtime configuration.
- Static assets are served from `public/`.
- Admin routes are mounted under `/admin`.
- Customer routes can be mounted under `/customer` as part of the single web app architecture.
- The root route redirects into the admin flow.
- Unknown routes return a shared 404 page.
- Unhandled errors return a shared error page.
- `database/schema.sql` exists.
- `database/setup.js` exists.
- `database/database.js` exists.
- SQLite foreign keys are enabled when the database is opened.
- `database/migrations.js` or equivalent migration support exists.
- The project has clear folders for routes, models, middleware, views, public assets, and database files.
- The story does not implement package purchases, deliveries, customer self-service, QR links, or dashboard metrics.

## 10. Out Of Scope

Admin login and logout are out of scope for this story.

Password hashing utilities are out of scope for this story.

Initial admin user setup may be supported by the broader database setup, but the full owner authentication workflow is out of scope.

Customer creation, customer search, and customer detail pages are out of scope.

Package purchase recording, fixed VND pricing, bonus cup rules, and balance crediting are out of scope.

Delivery recording, multi-cup delivery, insufficient-balance checks, and delivery voiding are out of scope.

Dashboard metrics and reporting are out of scope.

Customer login, customer portal, read-only customer histories, QR/shared balance links, and notification UI are out of scope.

Payment processing, ordering, loyalty features, offline mode, multi-shop support, and external database infrastructure are out of scope.

## 11. Definition Of Done

Story 1.1 is done when the application can be run locally as a single Express web application.

Story 1.1 is done when the project has a clear folder structure for future implementation.

Story 1.1 is done when SQLite setup and database helper files exist.

Story 1.1 is done when static assets and shared views are supported.

Story 1.1 is done when admin and customer route namespaces can be mounted inside the same app.

Story 1.1 is done when the app exposes `createApp()` for testing.

Story 1.1 is done when local commands exist for app startup, database setup, and tests.

Story 1.1 is done when later Owner MVP stories can proceed without restructuring the application foundation.

## 12. Expected Delivered Output

The expected delivered output is a working application foundation, not a complete membership workflow.

Expected delivered files and structures include:

- `server.js`
- `package.json`
- `config.js`
- `database/schema.sql`
- `database/setup.js`
- `database/database.js`
- `database/migrations.js`
- `routes/admin.js`
- `routes/customer.js`
- `views/`
- `views/shared/404.html`
- `views/shared/error.html`
- `public/`
- `public/css/styles.css`
- `public/js/admin.js`
- `models/`
- `middleware/`

Expected delivered commands include:

```sh
npm run dev
```

```sh
npm run db:setup
```

```sh
npm test
```

Expected delivered business outcome:

The project has a stable, low-maintenance foundation that supports the Owner MVP. The owner-facing workflows can now be built incrementally on top of a single Express application with local SQLite persistence. The delivered application confirms this expectation: the same foundation now supports admin authentication, customer management, package purchase recording, fixed VND pricing, bonus cup rules, delivery recording, delivery voiding, dashboard metrics, customer portal access, QR/shared balance links, and automated tests.
