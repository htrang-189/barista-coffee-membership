# Story 1.1: Express And SQLite Application Foundation

Workflow step: Amelia: sprint-planning

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD sprint-planning record generated after implementation

## 1. Sprint Planning Purpose

The purpose of this sprint-planning artifact is to document how Story 1.1 should be planned as the first implementation unit for the Phase 1 Owner MVP. This story establishes the working application foundation for the Barista Coffee Membership product, so the planning focus is not only on creating files but on reducing delivery risk for every later owner workflow.

The sprint plan for this story needed to answer a practical question: what minimum technical foundation must exist before Amelia can safely build owner login, customer management, package purchases, balance updates, deliveries, and dashboard metrics? The answer was a locally runnable Express application with SQLite persistence, predictable folder boundaries, static asset support, route mounting, shared error handling, and local scripts for development, database setup, and tests.

This planning step matters because the Owner MVP is an operational tool. If the first sprint creates an unstable or overly complex foundation, later business workflows become harder to implement and harder to trust. If the first sprint creates a focused and maintainable foundation, later stories can add owner value incrementally without changing the architecture.

## 2. Story Objective

The objective of Story 1.1 is to scaffold the Express and SQLite application foundation for the Owner MVP.

From a business perspective, the objective is to move the product from planning into a runnable system. The owner cannot manage prepaid cups through documentation alone. The product needs an application that can later record customer accounts, package purchases, credited cups, delivered cups, balance changes, and dashboard metrics.

From an implementation perspective, the objective is to create a working app shell that supports local development and future feature delivery. The story should leave the project with a server entry point, route folders, model folders, middleware folders, shared views, public assets, SQLite setup, reusable database helpers, and npm scripts.

The objective is intentionally foundational rather than feature-heavy. Story 1.1 should not attempt to implement the full owner workflow. It should create the base that lets later stories implement those workflows cleanly.

## 3. Planned Implementation Approach

The planned implementation approach is foundation-first and sequence-driven. Amelia should begin by establishing the runtime and project structure before adding business logic. This reduces the risk of mixing concerns and makes the app easier to extend.

The first planning decision is to use a single Express application. This matters because the final product is one web application with admin and customer route separation, not multiple independent apps. The sprint should therefore create `server.js` as the central application entry point and mount route modules under clear namespaces.

The second planning decision is to use SQLite for the MVP. This matters because the shop needs low-maintenance local persistence. The sprint should create the database folder, schema file, setup script, and database helper early, even if later stories add most of the business data behavior.

The third planning decision is to keep the frontend simple. The sprint should use server-rendered HTML views and static assets from `public/`. This supports a practical owner dashboard and form-based workflows without introducing a build pipeline or frontend framework during the foundation story.

The fourth planning decision is to make the app testable. `server.js` should export an app factory, such as `createApp()`, rather than only starting a server. This lets later tests instantiate the app directly and exercise routes without depending on a manually running process.

The fifth planning decision is to keep later business workflows out of scope. The sprint should prepare for admin authentication, customer management, package purchases, deliveries, and dashboard metrics, but it should not absorb those stories into the scaffold.

## 4. Work Breakdown

Work item 1: Initialize application runtime scripts.

This work includes defining the application entry point and npm scripts in `package.json`. The important scripts are local startup, database setup, and tests. This matters because the project must be easy to run locally and easy to validate.

Work item 2: Create the Express server entry point.

This work includes creating `server.js`, defining the Express app, adding body parsing, configuring sessions, serving static assets, mounting route modules, handling the root route, and adding shared 404/error handling. This provides the request lifecycle used by all later features.

Work item 3: Add configuration.

This work includes creating `config.js` to centralize environment-backed values such as host, port, database path, session secret, and bcrypt rounds. This prevents hardcoded settings from spreading across the codebase.

Work item 4: Create database foundation.

This work includes creating `database/schema.sql`, `database/setup.js`, `database/database.js`, and `database/migrations.js`. The database foundation should support local SQLite setup, foreign key enforcement, setup scripting, and future schema evolution.

Work item 5: Establish folder boundaries.

This work includes creating or confirming folders for `routes/`, `models/`, `middleware/`, `views/`, `public/`, and `database/`. These boundaries are a planning deliverable because they define how future work will be organized.

Work item 6: Add shared views and static assets.

This work includes shared error and not-found views and the public asset structure. These pieces make the app render predictable HTML states and support future visual styling.

Work item 7: Create the route foundation.

This work includes admin route mounting under `/admin` and customer route mounting under `/customer` as part of the single-app architecture. Phase 1 remains owner-focused, but the route structure should not block Phase 2.

Work item 8: Confirm local runnability.

This work includes starting the app locally, verifying that the root route enters the admin flow, confirming static assets can be served, confirming the database setup command can run, and confirming the test command exists.

## 5. Files Expected To Be Created

The sprint expects the following foundational files to be created if they do not already exist:

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

The sprint also expects the following folders to exist:

- `database/`
- `routes/`
- `models/`
- `middleware/`
- `views/`
- `views/shared/`
- `public/`
- `public/css/`
- `public/js/`

These files and folders matter because they become the stable implementation locations for later stories. The goal is not to create empty structure for its own sake. The goal is to prevent future owner workflows from being scattered across inconsistent locations.

## 6. Files Expected To Be Modified

The sprint expects `package.json` to be modified or created to define the application entry point, scripts, dependencies, and test command.

The sprint may also modify `package-lock.json` when dependencies are installed or updated. This is expected because the project needs reproducible dependency versions.

If `.env.example` exists or is part of the local setup convention, it may be updated in the broader foundation epic to document local environment variables. For Story 1.1 specifically, the critical configuration behavior is implemented through `config.js` and npm scripts.

No application business logic files should be modified for package purchases, deliveries, customer portal behavior, QR links, or dashboard metrics during this story. Those belong to later stories.

## 7. Routes / Models / Views Involved

Routes involved:

- `GET /` should redirect into the admin application flow, currently `/admin/dashboard`.
- `/admin/*` should be mounted through `routes/admin.js`.
- `/customer/*` should be mounted through `routes/customer.js` as part of the single application structure.
- Unknown routes should return the shared 404 page.

Models involved:

Story 1.1 does not implement full business models, but it establishes the `models/` folder and the database helper pattern that later models use. The delivered application later adds models for admin users, customer accounts, password hashing, package purchases, delivery history, cup balance rules, currency formatting, and dashboard metrics.

Views involved:

- `views/shared/404.html`
- `views/shared/error.html`
- The broader `views/` folder as the location for future admin and customer server-rendered pages.

The route/model/view plan matters because it keeps HTTP behavior, business logic, and presentation separate. This is especially important for a ledger-style product where balance-changing behavior must remain centralized and testable.

## 8. Data Impact

The planned data impact is to create the local SQLite foundation, not to complete every business workflow.

The expected database work includes a schema file and setup script. The delivered schema includes tables for admin users, customer accounts, package purchases, delivery history, and admin action logs. Although later stories use these tables directly, defining the relational shape early supports future implementation.

The sprint should ensure SQLite foreign keys are enabled through the database helper. This is a critical planning item because the app's data integrity depends on relationships between admins, customers, package purchases, and deliveries.

The sprint should also prepare for future schema evolution by including migration support. The delivered app includes `database/migrations.js`, which later supported implementation changes without requiring a full manual database reset.

The data impact should not include manually seeded customer memberships, package purchase records, or delivery records for production use. Those are operational records created through later owner workflows.

## 9. UI Impact

The UI impact of Story 1.1 is foundational. It does not deliver the final owner dashboard or customer portal UI, but it creates the rendering and asset structure needed for those screens.

The sprint should establish server-rendered HTML views and static assets. This allows later admin pages to use shared styling and browser-side enhancements without requiring a frontend build pipeline.

The immediate UI states expected from this story are shared 404 and error pages. These matter because even a foundation sprint should produce predictable user-facing behavior when routes are missing or errors occur.

The story should not introduce detailed package purchase UI, delivery UI, customer history UI, notification bell UI, or QR/share link UI. Those later UI elements should build on the view and public asset structure created here.

## 10. Testing Plan

The testing plan for this story is focused on foundation readiness rather than full business workflow validation.

The sprint should confirm that the application can start with:

```sh
npm run dev
```

The sprint should confirm that the local database can be initialized with:

```sh
npm run db:setup
```

The sprint should confirm that the test command exists and can be used by later stories:

```sh
npm test
```

At the foundation level, useful test coverage includes package credit rule unit tests when the foundation epic includes early model tests, route smoke tests for root/admin behavior, and database helper validation. In the delivered application, the current automated suite has expanded to 30 passing tests covering later owner and customer workflows, which confirms that the foundation supports testable implementation.

The test plan should not require end-to-end browser testing for Story 1.1 alone. Browser QA becomes more useful after visible admin and customer pages exist.

## 11. Risks

Risk 1: The sprint could overbuild the foundation.

If Story 1.1 introduces a complex frontend framework, external database infrastructure, or unnecessary platform abstractions, it would conflict with the MVP's low-maintenance goal. The mitigation is to keep the foundation to Express, SQLite, server-rendered views, and static assets.

Risk 2: The sprint could under-structure the application.

If everything is placed directly in `server.js`, later stories would become harder to maintain and test. The mitigation is to create clear folders for routes, models, middleware, views, public assets, and database code.

Risk 3: SQLite setup could be unreliable.

If the database path, schema execution, or foreign key enforcement is not handled consistently, later balance and history workflows could fail. The mitigation is to centralize database opening in `database/database.js`, setup in `database/setup.js`, schema in `database/schema.sql`, and migrations in `database/migrations.js`.

Risk 4: The app could be difficult to test.

If `server.js` only starts a listener and does not export an app factory, automated tests become harder to write. The mitigation is to export `createApp()` and start listening only when `server.js` is executed directly.

Risk 5: Admin and customer concerns could become mixed.

The final app has both admin and customer route surfaces. The mitigation is to mount `/admin` and `/customer` as separate route modules from the beginning, even though Phase 1 focuses on the owner/admin side.

## 12. Sprint Completion Criteria

The sprint is complete when the Express and SQLite foundation is implemented and ready for later Owner MVP stories.

Completion criteria:

- `server.js` exists and creates the Express app.
- `server.js` exports `createApp()`.
- The application starts locally with `npm run dev`.
- `package.json` includes local development, database setup, and test scripts.
- `config.js` centralizes runtime configuration.
- `database/schema.sql` exists.
- `database/setup.js` exists and supports local database initialization.
- `database/database.js` exists and enables SQLite foreign keys.
- `database/migrations.js` exists for later schema evolution.
- `routes/admin.js` exists and admin routes are mounted under `/admin`.
- `routes/customer.js` exists and customer routes are mounted under `/customer` as part of the single-app structure.
- `views/`, `public/`, `models/`, `middleware/`, and `database/` folders exist.
- Shared 404 and error views exist.
- Static assets are served from `public/`.
- The story does not implement later business workflows prematurely.
- Later stories can build owner authentication, customer management, package purchases, deliveries, and dashboard metrics without restructuring the app foundation.
