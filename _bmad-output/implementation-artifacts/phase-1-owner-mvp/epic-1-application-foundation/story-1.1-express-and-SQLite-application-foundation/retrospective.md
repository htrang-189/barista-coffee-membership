# Story 1.1: Express And SQLite Application Foundation

Workflow step: Amelia: retrospective

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD project documentation generated after implementation

## 1. Retrospective Purpose

The purpose of this retrospective is to document what was learned from delivering Story 1.1, Express And SQLite Application Foundation, and how that foundation affected the rest of the Barista Coffee Membership web application.

This retrospective is written after implementation, using the current delivered app as the source of truth. It is not a planning proposal. It records the actual delivery outcome and explains why the foundation succeeded as the base for the Owner MVP and later customer-facing features.

Story 1.1 is especially important to review because it shaped every later implementation decision. A foundation story can look simple on paper, but it determines whether later features are easy to build, test, and maintain. In this project, the Express and SQLite foundation became the base for admin authentication, customer management, package purchase recording, fixed VND pricing, bonus cup rules, multi-cup delivery, delivery voiding, dashboard metrics, customer login, shared QR/token access, notification UI, and automated tests.

## 2. What Was Delivered

Story 1.1 delivered a single Express web application foundation backed by SQLite.

The delivered foundation includes `server.js` as the main application entry point. It creates the Express app, configures request parsing, sets up sessions, prepares CSRF token support, serves static assets, waits for migrations, redirects the root route into the admin flow, mounts admin and customer routes, and provides shared 404 and error handling.

The story delivered local configuration through `config.js`. This file centralizes host, port, database path, session secret, environment, and bcrypt round settings. This made the app easier to run locally and easier to adjust without scattering environment logic through the codebase.

The story delivered SQLite database support through `database/schema.sql`, `database/setup.js`, `database/database.js`, and `database/migrations.js`. These files provide schema definition, local initialization, database opening, foreign key enforcement, and schema evolution support.

The story delivered the core folder structure used by the application: `routes/`, `models/`, `middleware/`, `views/`, `public/`, and `database/`. This structure became the organizing pattern for later implementation work.

The story also delivered local commands through `package.json`, including app startup, database setup, and test execution. These commands made the application practical to run and verify during later delivery.

## 3. What Went Well

The most successful part of the story was the decision to keep the foundation simple. Express and SQLite matched the scale of the product. The application serves one coffee shop and a small membership base, so the foundation did not need external database infrastructure or a large frontend framework to create business value.

The single-app architecture worked well. Admin routes and customer routes live in the same Express application while remaining separated by route modules and middleware. This avoided the overhead of managing separate applications while still supporting distinct owner and customer experiences.

The route, model, middleware, view, public asset, and database separation worked well. Later stories were able to add business behavior without restructuring the app. For example, package bonus rules could live in `models/cup-balance.js`, package purchase behavior could live in `models/package-purchase.js`, delivery behavior could live in `models/delivery-history.js`, and dashboard queries could live in `models/dashboard.js`.

Exporting `createApp()` from `server.js` also worked well. This made the app testable and allowed automated tests to exercise routes without requiring a manually running server process. The current test suite's broad coverage depends on this foundation.

SQLite setup also worked well for local development. The app can initialize a local database, run migrations, and persist data without needing a separate database service. This directly supported the product requirement that the app be easy to run locally.

## 4. What Changed During Implementation

The largest change was a clarification of stack complexity. Earlier solutioning considered more expansive modern stack options and future migration concerns. During implementation, the project course-corrected toward a simpler Express and SQLite foundation.

This change did not reduce product capability. The delivered app still supports the complete owner workflow and customer portal. It reduced infrastructure burden and made implementation more practical for the MVP.

Another change was that the foundation grew to support future Phase 2 route separation earlier than strictly required by Phase 1. The app mounts both `/admin` and `/customer` route modules as part of the single-app structure. Customer-facing behavior remained outside the initial Owner MVP scope, but the route foundation anticipated the final delivered application.

The database foundation also evolved during implementation. The initial schema/setup approach was extended with migration support so the app could adapt as requirements changed. Later features such as secure balance access tokens and delivery voiding benefited from this.

The documentation trail also changed. Early artifacts represented Story 1.1 as a scaffold story, but the final implementation made it clear that this story was the foundation for a much larger delivered app. This retrospective artifact records that broader delivery reality.

## 5. Problems Encountered

The main problem was avoiding mismatch between the original broader architecture assumptions and the actual MVP needs. A heavier stack could have created setup friction and maintenance burden for a small shop.

Another problem was the risk of database startup and connectivity friction. If the app required an external database or manual database setup, later implementation and testing would become slower and less reliable.

A related problem was ensuring SQLite behaved like a proper relational store. SQLite supports foreign keys, but they must be enabled for the connection. Without this, the app could appear to work while allowing inconsistent relational data.

There was also a structural risk: if the foundation did not create clear folders and boundaries, later business logic could become scattered across routes, views, and browser JavaScript. That would be especially risky for a balance ledger where calculations and data mutations must be reliable.

Finally, there was a testability risk. If the app startup was tightly coupled to a network listener, automated tests would be more cumbersome and less stable.

## 6. How Problems Were Resolved

The stack mismatch concern was resolved by choosing Express and SQLite for the MVP foundation. This kept the product aligned with the business context: one shop, small member base, low cost, and local runnability.

The database startup concern was resolved by adding `database/setup.js`, a configured database path in `config.js`, and a local setup script in `package.json`. The setup script initializes the local SQLite database and avoids manual table creation.

The SQLite relational integrity concern was resolved by enabling `PRAGMA foreign_keys = ON` in `database/database.js`. This ensures that foreign key relationships are enforced when the database is opened.

The structural risk was resolved by creating clear implementation folders. Routes, models, middleware, views, public assets, and database files each have distinct locations. Later implementation followed these boundaries, which helped keep business logic maintainable.

The testability risk was resolved by exporting `createApp()` from `server.js`. This made the app easier to test and supported the later automated test suite.

## 7. Lessons Learned

The first lesson is that a lean MVP still needs a disciplined foundation. Simplicity should not mean putting everything in one file. The delivered app stayed simple while still separating routes, models, middleware, views, assets, and database responsibilities.

The second lesson is that infrastructure should match business scale. A single small coffee shop does not need an external database server for the MVP. SQLite provided the persistence and constraints required without increasing setup burden.

The third lesson is that testability should be designed into the foundation. Exporting `createApp()` was a small decision with large benefits. It enabled reliable route and workflow testing later.

The fourth lesson is that future features should be anticipated through structure, not premature implementation. Mounting route modules and creating folder boundaries prepared the app for later customer portal and QR access features without implementing those features too early.

The fifth lesson is that documentation must keep up with iterative delivery. The initial scaffold story became the base for a complete delivered app, so the retrospective artifact set needed to be regenerated to reflect actual implementation.

## 8. Reusable Patterns

The `createApp()` pattern is reusable across the application. It lets the app be started normally in local development while also allowing tests to instantiate the app directly.

The route module pattern is reusable. Admin routes live under `/admin`, customer routes live under `/customer`, and each route area can have its own authorization and rendering behavior.

The model separation pattern is reusable. Database-backed business behavior belongs in `models/`, not directly in views or browser JavaScript. This became especially important for package pricing, bonus rules, balance updates, delivery validation, and voiding behavior.

The database helper pattern is reusable. Opening SQLite, enabling foreign keys, and using common query helpers keeps database access consistent.

The setup and migration pattern is reusable. `database/setup.js` and `database/migrations.js` allow the local database to be initialized and evolved without manual intervention.

The static asset pattern is reusable. The app can add visual polish and lightweight browser interactions through `public/css/styles.css` and JavaScript files without changing the server architecture.

## 9. Remaining Concerns

There are no remaining concerns that block Story 1.1 from being considered delivered.

One future concern is production hardening. If the application is deployed beyond local use, the session secret must be configured securely, cookie settings must be reviewed for the hosting environment, and SQLite backup strategy should be defined.

Another future concern is migration to a larger database. SQLite is suitable for the MVP, but if the product grows beyond the single-shop use case, a PostgreSQL migration may eventually be useful. The current route/model separation keeps that option practical, but it is not required for the delivered MVP.

A minor documentation concern is that the project now has multiple retrospective artifacts for Story 1.1. This is intentional based on the requested BMAD workflow documentation, but the index should remain clear so reviewers can find each workflow step.

## 10. Final Story Outcome

Story 1.1 is complete and delivered.

The Express and SQLite foundation successfully supported the full Phase 1 Owner MVP and later Phase 2 Customer Portal implementation. The current web app runs as a single Express application, persists data with SQLite, separates routes and models, serves static assets, renders server-side views, supports sessions, initializes the database locally, and runs automated tests.

The final outcome is positive. The story delivered the correct foundation for the product's business size and operational needs. It reduced setup complexity, supported maintainability, enabled testing, and allowed later owner and customer workflows to be implemented without replacing the architecture.
