# Story 1.1: Express And SQLite Application Foundation

Workflow step: John: check-implementation-readiness

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD readiness record generated after implementation

## 1. Readiness Purpose

The purpose of this readiness review is to determine whether Story 1.1, Express And SQLite Application Foundation, was sufficiently clear, feasible, and safe to begin implementation as the first technical story in Phase 1 Owner MVP.

This readiness step matters because Story 1.1 is the foundation for the full web application. If the foundation story is not ready, every later story inherits the risk. Admin authentication, customer management, package purchase recording, balance updates, delivery recording, dashboard metrics, customer portal access, and QR/shared balance links all depend on a stable application structure and persistence approach.

The readiness review therefore evaluates more than whether Express can be installed. It evaluates whether the story has enough business context, technical direction, data assumptions, folder conventions, and risk mitigation to support the owner-operated prepaid cup ledger product. The goal is to make sure implementation can begin without unresolved decisions that would later force a major rewrite.

This artifact uses the current delivered web application as the source of truth. The readiness decision is retrospective, but it is written in the style of the BMAD `check-implementation-readiness` step so the project submission has a complete implementation trail.

## 2. Story Readiness Summary

Story 1.1 was ready for implementation because it was narrow, foundational, and aligned with the approved Owner MVP goal. The story did not require unresolved business rules such as package pricing, bonus calculations, delivery voiding, customer login, or QR access. Instead, it created the application surface that those later rules could use.

The story was technically ready because the core stack had been narrowed to a simple Express web application with SQLite persistence. This stack matched the product context: a single coffee shop, a small member base, low maintenance expectations, low hosting cost, and local runnability. The delivered app confirms that this foundation was sufficient. The current codebase uses `server.js`, `config.js`, `database/`, `routes/`, `models/`, `middleware/`, `views/`, and `public/` exactly as the foundation story required.

The story was also business-ready because the owner MVP needed an operational system before it needed customer self-service. A web application scaffold does not directly let the owner sell or deliver cups, but it creates the structure required to build those owner workflows correctly. Without this story, later implementation would have risked becoming a collection of disconnected scripts, inconsistent routes, and ad hoc database access.

The readiness decision is PASS. The story had clear scope, manageable risk, minimal dependencies, and strong alignment with the MVP constraints.

## 3. Required Inputs

The first required input was the Phase 1 Owner MVP goal. The owner needed to operate the membership program end-to-end without customer-facing functionality. This meant the foundation had to prioritize admin routes, local persistence, and future owner workflows.

The second required input was the product constraint that the app should be low maintenance and easy to run locally. This shaped the readiness review strongly. A technically impressive architecture would not be ready if it required excessive setup or infrastructure for a very small shop. The delivered app validates this input by using a single Express application and local SQLite database.

The third required input was the source-of-truth technology direction. The implementation needed to follow the current Project Context rather than earlier exploratory options. The delivered system uses Node.js, Express, SQLite, server-rendered HTML, vanilla JavaScript, CSS assets, and Node's built-in test runner. This confirmed that the story had a realistic implementation path.

The fourth required input was the folder and ownership convention. A foundation story must define where later work belongs. The readiness review required confidence that future routes, models, middleware, views, database files, and public assets would have clear locations. The delivered app demonstrates this through the existing `routes/admin.js`, `routes/customer.js`, `models/`, `middleware/`, `views/`, `public/`, and `database/` directories.

The fifth required input was the expected local developer workflow. The application needed local commands for startup, database setup, and tests. The current `package.json` provides `npm run dev`, `npm run db:setup`, and `npm test`.

## 4. Technical Preconditions

The primary technical precondition was a working Node.js environment. The delivered `package.json` requires Node.js `>=22`, which supports the current runtime and Node's built-in test runner. This precondition was acceptable because the application is a modern local web app and because the test command is intentionally simple.

The second technical precondition was the availability of Express as the HTTP server framework. Express was appropriate because the product needs straightforward routing, form handling, sessions, static asset serving, and middleware support. The app does not require a complex frontend framework for the MVP because the workflows are form-driven and server-rendered.

The third technical precondition was local SQLite support through the `sqlite3` package. SQLite was essential to the readiness decision because the MVP should not depend on an external database server. The delivered app uses `database/database.js` to open SQLite and enable foreign keys, which confirms the feasibility of this precondition.

The fourth technical precondition was a session-capable server. Admin authentication and later customer authentication both depend on sessions. The foundation story needed to support `express-session` before authentication stories could be implemented. The delivered `server.js` configures session middleware with a named cookie, session secret, and cookie options.

The fifth technical precondition was a testable app construction pattern. The delivered `server.js` exports `createApp()`, allowing tests to instantiate the app without manually starting a server process. This matters because later BMAD QA work depends on repeatable automated validation.

The sixth technical precondition was a clear static asset path. The delivered app serves assets from `public/`, enabling consistent CSS and browser-side JavaScript without introducing a separate frontend build system.

## 5. Business Preconditions

The main business precondition was that Phase 1 should serve the owner first. The foundation story was ready because the business did not require customer self-service before owner operations existed. This allowed Story 1.1 to focus on admin route structure and the operational ledger foundation.

Another business precondition was that the app should remain intentionally simple. The coffee shop has a small membership base and does not need a loyalty platform, payment integration, ordering system, POS integration, or multi-shop administration in the MVP. This justified a lean Express and SQLite approach.

The business also needed confidence that the application could become the source of truth for prepaid cups. That meant the foundation needed to support persistent storage, not just temporary in-memory state. SQLite met this need while preserving local simplicity.

The owner workflow also required future auditability through history records. Even though Story 1.1 did not implement package or delivery history behavior directly, it needed to support a database-backed design where those histories could later be recorded. The delivered schema and model structure support that business need.

## 6. Data Preconditions

The data precondition for this story was that the product would require relational persistence. Customers, package purchases, deliveries, admin users, and later access tokens all relate to one another. The foundation therefore needed a database that could enforce relationships and constraints.

SQLite was ready for this need because it supports tables, indexes, uniqueness constraints, check constraints, and foreign keys. The delivered `database/schema.sql` includes relational tables for `admin_users`, `customer_accounts`, `package_purchases`, `delivery_history`, and `admin_action_logs`. It also includes constraints such as unique admin username, unique customer phone, unique customer login identifier, non-negative customer balance, valid package sizes, non-negative amount paid in cents, positive delivered cup quantities, and non-negative balance after delivery.

The foundation readiness review also required a setup mechanism. A database design is not implementation-ready if the developer must create tables manually. The delivered `database/setup.js` reads the schema, creates the database directory, opens the configured SQLite database, runs migrations, and seeds or confirms an initial admin user.

The data precondition also included future migration flexibility. The project was expected to evolve during implementation, and it did. The delivered app includes `database/migrations.js`, which allowed later schema changes without replacing the database setup approach. This was important for later features such as shared access tokens and delivery voiding fields.

## 7. UI/UX Preconditions

Story 1.1 did not require completed UI designs for the owner dashboard, customer detail page, package forms, delivery forms, or customer portal. However, it did require enough UI/UX preconditions to make server-rendered views feasible.

The first UI/UX precondition was that the app could use server-rendered HTML. The Owner MVP workflows are operational and form-based. They do not require a complex client-side application framework. This made a simple `views/` folder and static `public/` assets appropriate.

The second UI/UX precondition was that shared error and not-found pages should exist. This matters for product quality because even early builds should avoid exposing raw errors or blank pages. The delivered app includes shared 404 and error views.

The third UI/UX precondition was that future admin pages would need a consistent visual language. The foundation serves CSS from `public/css/styles.css`, making it possible to apply the Barista coffee-shop visual style across later owner and customer pages.

The fourth UI/UX precondition was that the app should remain mobile-friendly as later UI stories are added. Story 1.1 did not implement full responsive layouts by itself, but its static asset and view structure supports responsive CSS without changing the backend architecture.

## 8. Risks And Mitigations

Risk: The foundation could become too complex for the MVP.

Mitigation: Use Express, server-rendered HTML, static assets, and SQLite instead of a larger full-stack framework or external database infrastructure. The delivered app confirms that the simpler approach was enough for both Phase 1 and Phase 2.

Risk: Database setup could block local development.

Mitigation: Provide `npm run db:setup`, keep the database path configurable, create the database directory automatically, and use SQLite. The delivered `database/setup.js` and `config.js` address this risk.

Risk: Foreign key relationships might not be enforced in SQLite.

Mitigation: Enable `PRAGMA foreign_keys = ON` in `database/database.js`. This matters because the app depends on relationships between customers, purchases, deliveries, and admins.

Risk: Later stories could duplicate database access or mix business logic into route handlers.

Mitigation: Establish `models/` and `database/` as separate folders from `routes/`. The current delivered app follows this pattern with models for customer accounts, package purchases, delivery history, dashboard metrics, currency formatting, cup balance rules, password hashing, and admin users.

Risk: The app could become hard to test if startup and app creation were coupled.

Mitigation: Export `createApp()` from `server.js`. This allows tests to construct the app directly and supports Supertest-style route validation.

Risk: Customer routes might later require a separate app.

Mitigation: Mount both `/admin` and `/customer` route modules inside the same Express app. This preserves one application while still separating admin and customer behavior by route and authorization.

Risk: Early error handling might expose implementation details.

Mitigation: Add shared 404 and error handlers in the foundation. The app logs server-side errors and returns shared HTML error pages to users.

## 9. Dependency Review

Story 1.1 had no completed prior story dependency. It was the first foundation story and therefore needed to be independently buildable.

The story depended on approved product direction: a single-shop, owner-operated prepaid cup ledger with low maintenance needs. This dependency was satisfied by the current Project Context and later confirmed by the delivered app.

The story depended on technical stack decisions. Express and SQLite were selected because they matched the scale and maintenance profile of the MVP. This dependency was satisfied and is visible in `package.json`.

The story introduced dependencies for later stories. Owner authentication depends on sessions, admin routes, shared views, and config. Customer management depends on database setup and model structure. Package purchase and delivery stories depend on SQLite persistence and route/model separation. Dashboard stories depend on model query organization. Phase 2 customer portal features depend on the same app foundation and route separation.

The dependency review found no blocker. The foundation story could begin before later business workflows because it created the environment required for those workflows rather than relying on their details.

## 10. Readiness Decision: PASS / PASS WITH CONCERNS / FAIL

Readiness decision: PASS

Story 1.1 was ready for implementation.

## 11. Rationale For Decision

The readiness decision is PASS because the story was clearly scoped, aligned with the business goal, technically feasible, and low risk relative to later implementation work.

The business rationale is strong. The owner needs a reliable operational system before advanced or customer-facing features matter. A working Express and SQLite foundation directly supports that need by making the app runnable, persistent, and ready for owner workflows.

The technical rationale is also strong. Express provides exactly the routing and middleware capabilities needed by a small server-rendered web app. SQLite provides persistent local storage without external database infrastructure. The app can be run, initialized, and tested through simple npm scripts.

The dependency rationale is favorable. Because this story is foundational, it has few incoming dependencies and many outgoing dependencies. That makes it an appropriate first story. Starting with this story reduces risk for the rest of Phase 1 rather than increasing it.

The current implemented web app confirms the readiness decision retrospectively. The foundation supported the delivered Owner MVP and later Customer Portal without requiring replacement. That is strong evidence that the story was ready and correctly scoped.

## 12. Notes For Implementation

Implementation should keep the foundation intentionally simple. The goal is not to build a generalized platform. The goal is to create a stable web application base for a small coffee shop's prepaid cup ledger.

Implementation should keep the Express app in `server.js`, export `createApp()`, and only start the network listener when the file is executed directly. This keeps the app testable.

Implementation should centralize configuration in `config.js`, including host, port, database path, session secret, and bcrypt rounds. Environment variables should override local defaults where appropriate.

Implementation should use SQLite through `database/database.js` and enable foreign keys on every opened database connection. Database setup should remain scriptable through `database/setup.js`.

Implementation should preserve folder boundaries. Routes should belong in `routes/`, business/database behavior should belong in `models/`, reusable middleware should belong in `middleware/`, HTML should belong in `views/`, static assets should belong in `public/`, and schema/setup/migration files should belong in `database/`.

Implementation should avoid adding later business logic during the scaffold story. Admin authentication, customer management, package purchases, deliveries, dashboard metrics, customer portal, QR access, and notification UI belong to later stories. Story 1.1 should make those stories possible, not absorb their scope.

Implementation should leave clear evidence that the app can run locally. At minimum, the project should support `npm run dev`, `npm run db:setup`, and `npm test`.
