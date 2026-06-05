# Story 1.1: Express And SQLite Application Foundation

Workflow step: Amelia: dev-story

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD development record generated after implementation

## 1. Development Objective

The development objective of Story 1.1 was to build the first runnable version of the Barista Coffee Membership web application foundation. This story needed to turn the approved Owner MVP direction into a working technical base that later stories could extend safely.

From a product perspective, the objective was to create the minimum application structure required for the owner to eventually operate the prepaid cup ledger. The foundation itself does not record a package purchase or delivery, but it makes those workflows possible. It provides the server, database connection approach, route structure, view structure, static asset support, configuration, and local commands that future owner-facing stories rely on.

From an engineering perspective, the objective was to avoid both underbuilding and overbuilding. Underbuilding would have left later stories without clear boundaries, causing business logic to spread through route handlers or views. Overbuilding would have introduced unnecessary complexity for a single-shop MVP. The delivered implementation uses a single Express application with SQLite persistence, which matches the business need for a low-maintenance local web app.

## 2. Implementation Summary

The implementation delivered a single Express web application backed by SQLite. The application is defined in `server.js`, with configuration in `config.js`, persistence support in the `database/` folder, route modules in `routes/`, model modules in `models/`, middleware in `middleware/`, views in `views/`, and static assets in `public/`.

The server setup includes form parsing, JSON parsing, session middleware, CSRF token preparation, static asset serving, migration readiness handling, route mounting, root redirect behavior, shared not-found handling, and shared error handling. This establishes a complete request lifecycle before later business workflows are added.

The database setup includes a SQL schema, setup script, database helper, and migration support. This matters because the app is a ledger. Customer balances, package purchases, delivery history, and admin actions must persist reliably. SQLite was used because it supports the MVP's data needs without requiring external infrastructure.

The delivered foundation also supports automated testing. `server.js` exports `createApp()`, allowing tests to instantiate the application directly. This design choice later enabled route and workflow tests for admin authentication, customer management, package purchases, deliveries, dashboard metrics, customer portal access, QR/shared links, and password reset behavior.

## 3. Files Created

The foundation implementation created the core application files and folders needed by the web app.

Created files include:

- `server.js`
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

Created or established folders include:

- `database/`
- `routes/`
- `models/`
- `middleware/`
- `views/`
- `views/shared/`
- `public/`
- `public/css/`
- `public/js/`

These files and folders matter because they define how the rest of the application is organized. Later stories did not need to invent their own structure. They could add behavior in the appropriate layer.

## 4. Files Modified

The foundation implementation modified or established project metadata and dependency files.

Modified or established files include:

- `package.json`
- `package-lock.json`

`package.json` defines the application name, description, entry point, scripts, runtime dependencies, engine requirement, and test dependency. This file is important because it makes local operation explicit. The current scripts include:

- `npm run dev`
- `npm run db:setup`
- `npm test`

`package-lock.json` records the resolved dependency tree. This supports repeatable installs and keeps the local development environment predictable.

No product business-rule files were supposed to be modified as part of the scaffold story. Later implementation introduced business models such as cup balance, package purchase, delivery history, dashboard metrics, currency formatting, customer accounts, admin users, and password helpers.

## 5. Routes Implemented

The foundation implemented the route surface needed to enter and organize the web application.

Implemented route behavior includes:

- `GET /` redirects to `/admin/dashboard`.
- `/admin` route module is mounted through `routes/admin.js`.
- `/customer` route module is mounted through `routes/customer.js`.
- Unknown routes return the shared 404 page.
- Unhandled server errors return the shared error page.

The root redirect matters because the Owner MVP is admin-first. The owner dashboard is the operational entry point for the application. Even if authentication later redirects unauthenticated owners to login, the root route should still lead toward the owner workflow.

Mounting `/admin` and `/customer` separately matters because the final delivered app uses one Express process with route separation. Admin routes later handle owner operations. Customer routes later handle customer login, read-only balance pages, and shared access links. This route structure prevented the project from splitting into multiple applications.

## 6. Models / Business Logic Implemented

Story 1.1 did not implement final owner business workflows such as package purchases, delivery recording, delivery voiding, or dashboard metrics. That was intentional. The scaffold story's model responsibility was to create the place and pattern for later business logic.

The foundation established the `models/` folder as the location for business and database-facing modules. In the delivered app, this folder now contains modules such as:

- `models/admin-user.js`
- `models/customer-account.js`
- `models/cup-balance.js`
- `models/currency.js`
- `models/dashboard.js`
- `models/delivery-history.js`
- `models/package-purchase.js`
- `models/password.js`

The foundation also implemented database helper logic in `database/database.js`. This helper opens SQLite, enables foreign keys, and provides reusable query wrappers. Although these helpers are not business rules themselves, they are part of the business logic foundation because every later balance-changing workflow depends on reliable database access.

The most important business-aware decision was to separate future business logic from route handlers. This keeps ledger rules centralized and testable. For example, the final delivered app calculates package credits in model logic, stores amount paid in cents, updates balances transactionally, and voids deliveries through model functions rather than relying on browser-only behavior.

## 7. Views / UI Implemented

Story 1.1 implemented the view and asset foundation rather than the complete owner UI.

Implemented view support includes:

- `views/` as the server-rendered HTML location.
- `views/shared/404.html` for not-found states.
- `views/shared/error.html` for server-error states.
- `public/` for browser-accessible assets.
- `public/css/styles.css` for styling.
- `public/js/admin.js` for owner-side browser interactions used by later stories.

The shared 404 and error pages matter because the application should provide controlled user-facing responses even before all routes are complete. This is important for owner trust. A small operational tool should not expose stack traces or raw server failures to users.

The public asset setup matters because later owner and customer screens use the same visual system. The delivered web app now includes a Barista coffee-shop visual language, owner dashboard styling, customer membership card UI, history cards, notification bell, progress bar, and responsive layouts. Those later UI improvements were possible because Story 1.1 established static asset serving.

## 8. Database Impact

The database impact of Story 1.1 was foundational and significant. The story introduced SQLite as the MVP persistence layer and established the database setup path.

The delivered database files include:

- `database/schema.sql`
- `database/setup.js`
- `database/database.js`
- `database/migrations.js`

`database/schema.sql` defines the relational baseline for the app. The current delivered schema includes tables for admin users, customer accounts, package purchases, delivery history, and admin action logs. These tables support the full delivered product, including admin login, customer balances, package purchases, delivery records, delivery voiding, customer login, and shared access tokens.

`database/setup.js` initializes the local database. It reads the schema, creates the database directory when needed, opens the configured SQLite database, runs schema SQL, runs migrations, and seeds or confirms the initial admin user.

`database/database.js` opens SQLite and enables foreign key enforcement. Foreign keys matter because the application records relationships between admins, customers, purchases, and deliveries. Without foreign key enforcement, the ledger could accumulate orphaned or inconsistent records.

`database/migrations.js` supports incremental database evolution. This became important as the implementation grew to include features such as secure balance access tokens and delivery void/cancel support.

## 9. Security / Validation Implemented

The foundation implemented the security baseline needed for later owner and customer workflows.

Security and validation support includes:

- Express session middleware.
- Session cookie configuration with `httpOnly`.
- Session cookie `sameSite: 'lax'`.
- Production-aware secure cookie setting.
- Configurable session secret through `config.js`.
- CSRF token preparation through middleware.
- Shared error handling that avoids displaying raw stack traces to users.
- SQLite foreign key enforcement.

This story did not implement full admin authentication or customer authentication by itself. However, it prepared the session and middleware foundation that later authentication stories used.

The validation approach at this stage focused on structural correctness. The app must start, routes must mount, static assets must serve, the database must initialize, and errors must be handled consistently. Later validation expanded into automated tests covering full owner and customer workflows.

## 10. How This Supports The User Workflow

Story 1.1 supports the owner workflow by creating the application surface where owner actions can be performed.

The owner eventually needs to log in, create customers, record package purchases, see automatically calculated VND amounts, apply bonus cup rules, record deliveries, void mistakes, and review dashboard metrics. Each of those workflows requires the foundation delivered by this story.

The Express app supports the workflow by receiving owner requests and routing them to the correct admin handlers. SQLite supports the workflow by persisting customer and ledger data. The view structure supports the workflow by rendering admin pages and forms. The public asset structure supports the workflow by making the interface readable and usable. The session foundation supports the workflow by enabling protected owner access.

This story also supports customer trust indirectly. Customers later see read-only balances and histories derived from owner-entered data. That customer-facing reliability depends on the owner workflow being backed by a consistent server and database foundation.

## 11. Delivered Output

The delivered output is a working Express and SQLite application foundation.

Delivered outputs include:

- A single Express application in `server.js`.
- Local development script through `npm run dev`.
- Local database setup script through `npm run db:setup`.
- Automated test command through `npm test`.
- Centralized runtime configuration in `config.js`.
- SQLite database schema and setup files.
- Database helper with foreign key enforcement.
- Migration support.
- Admin route namespace.
- Customer route namespace for the single-app architecture.
- Shared 404 and error pages.
- Static asset serving.
- Clear route/model/middleware/view/public/database structure.

This output became the base for the completed Phase 1 Owner MVP and Phase 2 Customer Portal.

## 12. Evidence From Current Web App

The current implemented web app provides direct evidence that Story 1.1 was delivered.

Evidence from the codebase:

- `server.js` creates the Express app and exports `createApp()`.
- `package.json` defines `dev`, `db:setup`, and `test` scripts.
- `config.js` centralizes environment-backed settings.
- `database/schema.sql` defines the schema.
- `database/setup.js` initializes the database.
- `database/database.js` opens SQLite and enables foreign keys.
- `database/migrations.js` runs schema migrations.
- `routes/admin.js` contains the admin route module.
- `routes/customer.js` contains the customer route module.
- `views/shared/404.html` and `views/shared/error.html` exist.
- `public/css/styles.css` and `public/js/admin.js` support the web UI.
- `models/` and `middleware/` contain the later business and request-processing modules.

Evidence from delivered behavior:

- The app runs locally as a single Express web application.
- The owner/admin portal is served under `/admin/*`.
- The customer portal is served under `/customer/*`.
- SQLite persists admin, customer, purchase, delivery, and access-token data.
- Static assets render the Barista visual style.
- Automated tests run through the Node test command.

Evidence from downstream features:

- Admin authentication works.
- Customer management works.
- Package purchase recording works.
- Fixed VND pricing and bonus cup rules work.
- Multi-cup delivery recording works.
- Delivery voiding works.
- Dashboard metrics work.
- Customer portal and shared QR/token access work.

These downstream features demonstrate that the foundation was not merely scaffolded but successfully supported the completed web application.
