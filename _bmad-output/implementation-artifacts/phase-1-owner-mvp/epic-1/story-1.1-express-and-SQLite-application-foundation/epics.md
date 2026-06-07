# Story 1.1: Scaffold Express Application

Workflow step: John: create-epics-and-stories

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD documentation artifact generated after implementation

## 1. Phase Context

Phase 1 Owner MVP exists to let the coffee shop owner operate the prepaid cup membership program from the admin side of the web application. The phase is focused on owner operations only: logging in, managing customers, recording package purchases, calculating credited cups, tracking balances, recording deliveries, correcting mistaken deliveries, and reviewing basic dashboard metrics.

This phase matters because the business must first be able to run the membership program internally before customer-facing self-service adds value. If the owner cannot reliably create customers, credit purchases, subtract delivered cups, and see current balances, then customer views would only expose unreliable or incomplete data. Phase 1 therefore establishes the operational source of truth for the product.

Story 1.1 belongs at the start of Phase 1 because every later owner workflow requires a working web application foundation. The owner MVP cannot be implemented directly as isolated screens or scripts. It needs a single application process, route structure, persistence layer, static asset serving, local startup command, and baseline folder organization. This story provides that foundation.

## 2. Epic Context

Epic 1: Application Foundation creates the technical base for the Owner MVP. The purpose of this epic is not to deliver the full business workflow in one step, but to make the app runnable, structured, and ready for incremental implementation.

The application foundation must support a small coffee shop environment. The app is intentionally low maintenance and locally runnable. The final implementation uses a single Express web application with SQLite persistence. This aligns with the product's operating model: one shop, a small membership base, no external payment processing, and no need for complex infrastructure during the MVP.

Within this epic, Story 1.1 establishes the Express app scaffold. Later foundation and owner stories build on top of it by adding environment configuration, database setup, database helpers, package credit calculation, admin authentication, customer management, purchases, deliveries, dashboard metrics, and tests.

## 3. Story Identification

Story number: Story 1.1

Story title: Scaffold Express Application

Phase folder: `phase-1-owner-mvp`

Epic folder: `epic-1-application-foundation`

Workflow step: `create-epics-and-stories`

Primary actor: Coffee shop owner, represented indirectly because this story creates the technical foundation needed for owner-facing workflows.

Implementation status: Delivered in the current web application.

## 4. Business Problem

The coffee shop needs a simple system to replace informal prepaid cup tracking. Without an application foundation, the shop would remain dependent on paper notes, punch cards, or spreadsheets. Those tools may work for a very small number of customers, but they become risky when the owner needs to know whether a customer has cups remaining, when purchases were recorded, how many cups have been delivered, and whether a mistake was corrected.

The business problem is not only "build a web server." The deeper problem is that the owner needs a reliable operational ledger. A ledger requires persistence, repeatable workflows, and consistent data handling. Story 1.1 begins solving that problem by creating the web application shell where owner actions can later be implemented in a controlled and testable way.

The story also reduces delivery risk. If the team postponed the application scaffold until after defining business features, later implementation work would have no common structure. Routes, views, models, and database access might be created inconsistently. By identifying this story first, the project establishes a technical base that supports incremental delivery rather than one large, fragile implementation batch.

## 5. User Need

The owner needs the membership application to be easy to run and maintain. The owner does not need an enterprise platform or a complex loyalty product. The owner needs a practical tool that supports daily membership operations with minimal setup burden.

From the owner's perspective, Story 1.1 is valuable because it makes the product real enough to run locally and extend. Although the owner may not interact directly with the scaffold as a feature, every owner-facing screen depends on it. Admin login, dashboard, customer pages, package purchase forms, delivery forms, and history pages all require the application foundation created by this story.

From the implementation team's perspective, this story creates a predictable place to add future work. Admin workflows can go under `/admin/*`, customer workflows can later go under `/customer/*`, database logic can live in `models/` and `database/`, browser assets can live in `public/`, and server-rendered pages can live in `views/`.

## 6. Story Statement

As the project team building the Owner MVP, we need to scaffold a simple Express web application so that the coffee shop membership product has a locally runnable server, clear folder structure, static asset support, route boundaries, and a foundation for SQLite-backed owner workflows.

This story supports the owner by enabling all later operational features to be implemented inside one coherent web application instead of scattered scripts, manual database operations, or disconnected screens.

## 7. Functional Scope

The functional scope of Story 1.1 includes creating the initial Express application shell and project structure needed for the Owner MVP.

The delivered application foundation includes `server.js` as the main application entry point. It creates the Express app, applies request parsing, configures session middleware, prepares CSRF token support, serves static assets from `public/`, waits for migrations, redirects the root route to the admin dashboard flow, mounts admin routes under `/admin`, mounts customer routes under `/customer`, and provides shared 404 and error handling.

The scope includes defining the project scripts in `package.json`. The important scripts are `npm run dev` for local startup, `npm run db:setup` for database setup, and `npm test` for automated validation. These scripts matter because the product must be easy to run locally and easy to verify.

The scope includes establishing folders for routes, models, middleware, views, public assets, and database files. This is a functional part of the story because it determines how future owner workflows are implemented. A clear folder structure prevents later stories from mixing route handling, business logic, database operations, and presentation concerns.

The scope also includes creating the route foundation for the admin area. Even before every owner workflow is complete, the app needs a defined admin route namespace so owner functionality is separated from future customer-facing functionality.

## 8. Out of Scope

This story does not include complete admin authentication. It may create the application structure needed for sessions and admin routes, but owner login and logout are separate owner authentication stories.

This story does not include customer management, package purchase recording, balance calculation, delivery recording, delivery voiding, dashboard metrics, customer portal behavior, QR/share balance links, payment processing, ordering, loyalty rewards, or production deployment automation.

This story does not introduce multiple applications. The delivered product is a single Express web application with route separation between admin and customer areas. The scaffold should not create a separate frontend app, separate customer app, or separate admin app.

This story does not require external database infrastructure. The MVP uses SQLite so the app can run locally with low setup cost.

## 9. Acceptance Criteria

The story is accepted when the project has a runnable Express application foundation.

Acceptance criteria:

- `server.js` exists and defines the Express application.
- The application can be started locally with `npm run dev`.
- `package.json` includes the required local scripts.
- The app serves static assets from `public/`.
- The app has a clear folder structure for `routes/`, `models/`, `middleware/`, `views/`, `public/`, and `database/`.
- Admin routes are mounted under `/admin`.
- Customer routes can be mounted under `/customer` as part of the single-app route structure, without making customer self-service part of Phase 1 scope.
- The root route leads into the admin application flow.
- The application includes shared not-found and error handling.
- The scaffold supports later SQLite-backed implementation work.
- The story does not implement business logic that belongs to later epics.

## 10. Dependencies

This story has minimal functional dependencies because it is the first implementation story in the Owner MVP. It depends on the project decision to build a web application, the approved direction to keep the MVP low-maintenance, and the availability of a Node.js runtime.

Technical dependencies include Express for the HTTP server, Node.js for runtime execution, npm for scripts and dependency management, and the project folder structure where implementation files will live.

Architectural dependencies include the decision to keep the app as one Express application rather than multiple separate apps. This dependency matters because route separation, session handling, shared assets, and future customer access all rely on a single app foundation.

Future stories depend heavily on this story. Owner authentication depends on the route and session foundation. Customer management depends on the app structure and database foundation. Package purchases and deliveries depend on the model/database pattern. Dashboard metrics depend on routes, views, and model query organization. Phase 2 customer portal and shared balance access later reuse the same Express application and route structure.

## 11. Expected Output

The expected output of this story is not a fully operational membership product. The expected output is a reliable application scaffold that later stories can extend.

Expected output includes:

- A runnable Express application.
- A main server entry point in `server.js`.
- npm scripts for local development and testing.
- A project structure that separates routes, models, middleware, views, public assets, and database files.
- Static asset serving.
- Admin route mounting.
- Shared 404 and error handling.
- A foundation ready for SQLite setup and model-driven owner workflows.

The expected business outcome is reduced implementation risk. After this story, the team should be able to implement admin authentication, customer management, package purchase workflows, delivery workflows, and dashboard metrics inside an established application structure.

## 12. Traceability to Delivered Web App

The current delivered web application confirms that Story 1.1 was implemented and successfully supported the rest of the product.

Traceability evidence:

- `server.js` is the delivered Express application entry point.
- `package.json` defines `npm run dev`, `npm run db:setup`, and `npm test`.
- `config.js` centralizes local runtime configuration.
- `database/schema.sql`, `database/setup.js`, `database/database.js`, and `database/migrations.js` provide the SQLite-backed persistence foundation used by later stories.
- `routes/admin.js` contains the owner/admin route surface under `/admin/*`.
- `routes/customer.js` later uses the same application foundation for Phase 2 customer routes under `/customer/*`.
- `views/` contains server-rendered HTML pages for shared, admin, and customer experiences.
- `public/` contains static CSS and JavaScript assets used by the web UI.
- `models/` contains the business and database model modules added by later stories.
- `middleware/` contains reusable request middleware for authentication and CSRF support.

The delivered application now includes admin login, customer management, package purchases, fixed VND pricing, bonus cup rules, delivery recording, delivery voiding, dashboard metrics, customer login, customer read-only portal, QR/shared balance link access, notification UI, and tests. Those later outcomes demonstrate that the scaffold created by Story 1.1 was sufficient and did not need to be replaced.

Story 1.1 is therefore traceable from the original Owner MVP need through the implemented web application foundation and into the completed Phase 1 and Phase 2 product behavior.
