# Story 1.1: Express And SQLite Application Foundation

Workflow step: John: correct-course

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD change-control record generated after implementation

## 1. Correct-Course Purpose

The purpose of this correct-course artifact is to document the key foundation-level direction that shaped Story 1.1: the project should use a simple, locally runnable Express and SQLite application foundation for the Owner MVP.

This correct-course record is written in business analysis change-control style. It explains what changed or was clarified, why the change mattered, and how the decision affected scope, UI, data, logic, testing, and the final delivered application.

The course correction was important because the application foundation determines the cost and complexity of every later story. If the foundation had followed a heavier stack or external database assumption, the product could have become harder to run, harder to test, and less aligned with the needs of a single small coffee shop. The delivered web app confirms that the chosen course was appropriate.

## 2. Original Assumption

The original planning discussion included a broader modern web stack direction and future migration considerations. Earlier architecture preferences included technologies such as Next.js, TypeScript, Tailwind CSS, Prisma, SQLite, and potential PostgreSQL migration flexibility.

Those assumptions were reasonable during early solutioning because they considered future maintainability, common modern development patterns, and database migration paths. However, they also risked creating more implementation overhead than the MVP required.

For Story 1.1 specifically, the original assumption that needed correction was not the need for a web application. That requirement remained stable. The assumption that needed refinement was the level of stack complexity and database infrastructure appropriate for the first delivered owner-operated MVP.

The product did not need a separate frontend framework, Prisma schema layer, or external PostgreSQL database to prove the owner workflow. The shop needed a simple, reliable, locally runnable app that could store and display ledger data.

## 3. Issue Or Change Trigger

The change trigger was the confirmed MVP operating context.

The product is for one coffee shop, not a multi-shop SaaS platform. The expected number of membership customers is very small. Payments are handled outside the app. The app records package purchases, balance changes, deliveries, and revenue, but it does not process payments. The owner needs a practical operational tool, not a complex loyalty or commerce platform.

This context made it clear that the first implementation foundation should prioritize local runnability, low maintenance, and low setup cost. A heavier stack would have increased implementation and operational risk without improving the core owner workflow.

The database consideration was especially important. If the MVP depended on PostgreSQL or external database infrastructure, the owner or maintainer would need to manage a database service before using the app. That would conflict with the requirement that the app be easy to run locally.

The trigger therefore was a fit-to-purpose review: the foundation should match the actual business scale and not the capabilities of a larger product architecture.

## 4. Decision Made

The decision was to implement Story 1.1 as a single Express web application backed by SQLite.

The delivered implementation uses:

- Express for the web server and route layer.
- SQLite for local persistence.
- Server-rendered HTML views.
- Static assets from `public/`.
- CommonJS modules.
- `express-session` for session support.
- A local configuration file in `config.js`.
- Database setup, helper, schema, and migration files under `database/`.
- Route, model, middleware, view, and public asset separation.

The decision also clarified that the application should remain one app with route separation, not multiple separate apps. Admin routes live under `/admin/*`, and customer routes later live under `/customer/*`.

The decision preserved future migration possibility by keeping database access centralized, but it removed external database infrastructure as a requirement for the MVP.

## 5. Business Rationale

The business rationale was simplicity and operational fit.

The coffee shop owner needs to run a prepaid cup ledger with minimal friction. The owner should not need to understand external database services, separate frontend builds, or deployment architecture before the product is useful. The app should start locally, store data locally, and support the daily membership workflow.

SQLite supports this business need because it gives the app real persistence without adding infrastructure. Express supports this business need because it provides a straightforward web application layer for forms, dashboards, histories, and route protection.

This decision also protects the MVP from becoming a loyalty platform or SaaS system prematurely. The business value is not in technical sophistication. The business value is in accurate balances, clear owner workflows, simple customer records, package history, delivery history, and confidence that prepaid cups are tracked correctly.

By choosing Express and SQLite, the team reduced setup risk and kept the implementation aligned with the shop's actual scale.

## 6. Technical Rationale

The technical rationale was that Express and SQLite provide the necessary foundation with the fewest moving parts.

Express is sufficient for the app's route needs. The application uses standard form submissions, server-rendered pages, sessions, static assets, and middleware. It does not require a separate API server plus client-side application for the MVP.

SQLite is sufficient for the app's data needs. The delivered app stores admin users, customer accounts, package purchases, delivery history, action logs, access tokens, balances, and related timestamps. SQLite supports the constraints and indexes needed to make this reliable at MVP scale.

Centralized database helpers reduce future migration risk. The delivered app uses `database/database.js`, `database/setup.js`, `database/schema.sql`, `database/migrations.js`, and model modules rather than scattering database code throughout views or browser JavaScript. This keeps the door open for future database migration if the product grows.

Exporting `createApp()` from `server.js` improves testability. This lets automated tests instantiate the app directly, which became important for the current test suite.

The technical rationale therefore balances simplicity with enough structure to support the full delivered app.

## 7. Impact On Scope

The course correction narrowed the implementation scope of Story 1.1 to a practical foundation.

In scope after the decision:

- Single Express app.
- Local SQLite database.
- Local startup script.
- Local database setup script.
- Route/module folder structure.
- Static asset serving.
- Shared error and not-found handling.
- Testable app factory.

Out of scope after the decision:

- Separate frontend application.
- Separate customer application.
- Prisma setup.
- PostgreSQL setup.
- External database provisioning.
- Deployment automation.
- Payment processing.
- Loyalty platform capabilities.

This scope reduction was beneficial. It allowed Story 1.1 to be implemented quickly and made later owner stories easier to deliver incrementally.

## 8. Impact On UI

The UI impact was that the project would use server-rendered HTML views and static assets rather than a separate frontend application.

This decision fit the Owner MVP because the workflows are operational and form-based. Admin login, customer creation, package purchase recording, delivery recording, password reset, histories, and dashboard views can be served effectively from the Express app.

The decision did not reduce visual quality. The delivered app later gained a polished Barista visual style, responsive owner pages, customer membership card UI, progress bar, notification bell, low-balance messages, history cards, and QR/share link controls using the same server-rendered and static asset foundation.

The UI impact for Story 1.1 was therefore positive. It avoided frontend complexity while still preserving the ability to deliver a clean, mobile-friendly web interface.

## 9. Impact On Data / Logic

The data impact was to use SQLite as the MVP database and to keep business logic in model modules.

SQLite changed the implementation path by removing the need for external database setup. The delivered database path is configured through `config.js`, and the default local database lives at `database/app.db`.

The delivered schema includes relational tables and constraints. It supports admin users, customer accounts, package purchases, delivery history, and admin action logs. Later implementation added or used fields for balance access tokens, package amounts in cents, bonus cups, delivery quantities, voiding, and balance values.

The logic impact was to keep calculations and data-changing workflows out of the scaffold story while preparing the model layer for later use. This allowed later rules such as fixed VND pricing, `10 -> 11`, `20 -> 22`, `30 -> 33` bonus credits, multi-cup delivery, and voiding to be centralized in model logic.

The course correction therefore improved data and logic maintainability by keeping the foundation simple but structured.

## 10. Impact On Testing

The testing impact was positive.

By using a single Express app and exporting `createApp()`, the project became easier to test with route-level and workflow-level tests. Tests do not need to manage a separate frontend build or external database service. They can instantiate the app and exercise routes directly.

SQLite also supports local testability because it avoids external database connection failures. The app can use local database paths and setup scripts, making test runs more predictable.

The delivered app now has a test suite run through:

```sh
npm test
```

The current suite includes 30 passing tests across owner and customer workflows. That outcome is evidence that the corrected foundation supported a reliable testing strategy.

The decision also allowed browser-level QA to focus on rendered pages and layout issues rather than environment setup problems.

## 11. Updated Requirement

Updated requirement:

Story 1.1 shall implement a single Express web application foundation using SQLite for local MVP persistence.

The application shall:

- Start locally through `npm run dev`.
- Provide database setup through `npm run db:setup`.
- Provide automated test execution through `npm test`.
- Use `server.js` as the main app entry point.
- Export `createApp()` for testability.
- Use `config.js` for runtime configuration.
- Use SQLite through `database/database.js`.
- Enable SQLite foreign keys.
- Define schema in `database/schema.sql`.
- Support migrations through `database/migrations.js`.
- Mount admin routes under `/admin`.
- Mount customer routes under `/customer` as part of the single-app architecture.
- Serve static assets from `public/`.
- Render shared error and not-found pages from `views/`.
- Keep business workflows for authentication, customers, packages, deliveries, dashboard, customer portal, and QR access in later stories.

## 12. Final Outcome

The final outcome was successful.

The delivered application uses the corrected Express and SQLite foundation. The foundation has supported the complete Phase 1 Owner MVP and Phase 2 Customer Portal without architectural replacement.

Delivered evidence includes:

- `server.js` as the Express app foundation.
- `config.js` for configuration.
- `database/schema.sql`, `database/setup.js`, `database/database.js`, and `database/migrations.js` for SQLite persistence.
- `/admin/*` owner route structure.
- `/customer/*` customer route structure.
- `views/` for server-rendered pages.
- `public/` for static CSS and JavaScript.
- `models/` and `middleware/` separation.
- Local commands for startup, database setup, and tests.

The course correction reduced setup risk, lowered maintenance burden, preserved testability, and aligned the technical implementation with the real business scale of the coffee shop membership product.
