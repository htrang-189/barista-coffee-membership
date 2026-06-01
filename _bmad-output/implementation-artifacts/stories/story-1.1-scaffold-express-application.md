# Story 1.1: Scaffold Express Application

Date: 2026-06-01
Project: barista-coffee-membership
Phase: Phase 1 Owner MVP
Sprint: Sprint 1 Owner MVP Foundation
Status: Completed

## Story

As a developer, I want the Express app scaffolded with the approved folder structure so owner features have a consistent implementation base.

## Business Context

Phase 1 delivers an owner-operated MVP only. The coffee shop owner must eventually be able to manage customers, record package purchases, calculate credited cups, record deliveries, and view balances without any customer-facing functionality.

This story creates the minimal runnable application foundation. It should not implement business workflows yet.

## Scope

Implement the Express application scaffold and Phase 1 folder structure.

Included:

- `server.js`
- `package.json`
- Basic Express app startup
- Static file serving from `/public`
- Placeholder route organization under `/routes`
- Placeholder middleware organization under `/middleware`
- Placeholder model organization under `/models`
- Placeholder owner/admin views under `/views`
- Basic local development script: `npm run dev`

Excluded:

- Customer-facing routes.
- Customer-facing views.
- Customer login.
- Admin login implementation.
- Database schema.
- Package credit business logic.
- Tests beyond a basic app-start sanity check if desired.
- CSRF.
- Production deployment setup.

## Source Artifacts

- Project Context: `_bmad-output/project-context.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Phase 1 Epics & Stories: `_bmad-output/planning-artifacts/phase-1-owner-mvp-epics-and-stories.md`
- Sprint Status: `_bmad-output/implementation-artifacts/sprint-status.md`

## Requirements

### Functional Requirements

- The app can be started locally.
- The root route should respond with a simple page or redirect placeholder.
- Static assets should be served from `/public`.
- Folder structure should support later Phase 1 stories.

### Technical Requirements

- Use Node.js v22.x.
- Use Express.js v4.x.
- Use vanilla HTML/CSS/JavaScript only.
- Use clear CommonJS or project-consistent JavaScript module style.
- Use `const` and `let`, never `var`.
- Use descriptive names.
- Keep code simple and readable.

### Phase 1 Scope Guardrails

- Do not scaffold `/customer/*` routes in this story.
- Do not create customer-facing view files in this story.
- Do not implement customer session logic.
- Do not implement package purchase, delivery, or dashboard logic yet.

## Acceptance Criteria

- `server.js` starts an Express v4 app.
- Static files are served from `/public`.
- Routes are organized under `/routes`.
- Middleware is organized under `/middleware`.
- Models/business logic are organized under `/models`.
- Views are organized under `/views`.
- App can be started locally with `npm run dev`.
- A basic route responds successfully in the browser or via HTTP request.
- No customer-facing login, route, or portal page is implemented.

## Suggested File Changes

Create:

- `package.json`
- `server.js`
- `routes/admin.js`
- `middleware/.gitkeep` or an initial placeholder module
- `models/.gitkeep` or an initial placeholder module
- `views/admin/`
- `views/shared/`
- `public/css/styles.css`
- `public/js/admin.js`

Do not create in this story:

- `routes/customer.js`
- `views/customer/`
- `views/shared/customer-login.html`

## Implementation Notes

- A simple `GET /` can redirect to `/admin/dashboard` or return a placeholder. If redirecting to `/admin/dashboard`, the dashboard can be a placeholder page until auth is implemented.
- A simple `GET /admin/dashboard` placeholder is acceptable for this story.
- Keep placeholder HTML minimal.
- Do not introduce a template engine unless implementation clearly needs it. Static HTML or simple file serving is enough for this scaffold.

## Dependencies

None.

## Testing Guidance

Minimum verification:

- Run `npm install`.
- Run `npm run dev`.
- Confirm the app starts without crashing.
- Confirm the basic route responds.
- Confirm static CSS/JS can be served if referenced.

Optional:

- Add a lightweight smoke test only if the test harness is introduced in this story. The main test harness is planned for Story 1.6.

## Definition Of Done

- App starts locally with `npm run dev`.
- Phase 1 scaffold folders exist.
- Basic admin/owner placeholder route works.
- No customer-facing functionality exists.
- Code follows Project Context conventions.

## Dev Completion Notes

- Created the Express app scaffold in `server.js`.
- Added owner-only admin route organization in `routes/admin.js`.
- Added placeholder owner dashboard view.
- Added shared 404 and error views.
- Added static CSS and admin JavaScript placeholders.
- Added placeholder `middleware` and `models` folders.
- Added `package.json` with `start` and `dev` scripts.
- Added `.gitignore` for generated dependencies and local environment/database files.
- Bound the local server to `127.0.0.1` by default, with `HOST` override available for later deployment needs.

## Verification

- Ran `npm install`.
- Ran `npm run dev`.
- Verified `GET /admin/dashboard` returns `200`.
- Verified `GET /css/styles.css` returns `200`.
- Verified `GET /` redirects to `/admin/dashboard`.
- Verified no `routes/customer.js`, `views/customer/`, or `views/shared/customer-login.html` exists.

## Next Story

Story 1.2: Add Environment Configuration.
