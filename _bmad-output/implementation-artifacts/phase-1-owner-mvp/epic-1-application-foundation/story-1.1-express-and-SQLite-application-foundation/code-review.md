# Story 1.1: Express And SQLite Application Foundation

Workflow step: Amelia: code-review

Phase: Phase 1 Owner MVP

Epic: Epic 1: Application Foundation

Status: Complete / Delivered

Artifact type: Retrospective BMAD code review record generated after implementation

## 1. Review Purpose

The purpose of this code review is to evaluate the delivered implementation of Story 1.1, Express And SQLite Application Foundation, against the needs of the Phase 1 Owner MVP and the current completed web application.

This review focuses on whether the foundation is organized, maintainable, secure enough for the MVP, compatible with later owner workflows, and appropriate for a small coffee shop membership product. The review does not assess every later feature in depth. Instead, it evaluates whether the foundation story created a reliable base that later features could build on without requiring architectural replacement.

Because this is a retrospective BMAD artifact, the review uses the current working app as evidence. The delivered app now includes owner/admin workflows, customer portal workflows, QR/shared balance links, fixed VND pricing, bonus cup rules, multi-cup delivery, delivery voiding, history views, notification UI, and automated tests. The fact that these features run on the same foundation is part of the review evidence.

## 2. Reviewed Scope

The reviewed scope includes the application foundation files and structures created or established by Story 1.1.

Reviewed files and areas include:

- `server.js`
- `package.json`
- `config.js`
- `database/schema.sql`
- `database/setup.js`
- `database/database.js`
- `database/migrations.js`
- `routes/admin.js`
- `routes/customer.js`
- `models/`
- `middleware/`
- `views/`
- `views/shared/404.html`
- `views/shared/error.html`
- `public/`
- `public/css/styles.css`
- `public/js/admin.js`

The review includes route organization, app startup, middleware wiring, local database setup, database helper design, error handling, static asset serving, folder structure, and readiness for later features.

The review does not treat later business workflows as part of Story 1.1's implementation scope. Package purchase logic, delivery logic, customer portal behavior, password reset behavior, and QR access are used as evidence that the foundation held up, but they are not reviewed as if they were required deliverables for this story.

## 3. Code Organization Review

The code organization is appropriate for a small operational web application. The app has a clear server entry point in `server.js`, central configuration in `config.js`, database files in `database/`, route modules in `routes/`, model modules in `models/`, middleware in `middleware/`, HTML views in `views/`, and static assets in `public/`.

This organization matters because the product is a ledger-style application. Ledger behavior must be understandable and traceable. If route handlers, database access, UI rendering, and business logic were mixed together, later changes to package pricing, bonus rules, delivery quantity, or voiding behavior would be risky. The delivered foundation avoids that by establishing distinct implementation areas.

`server.js` is well scoped as the application composition file. It creates the Express app, applies middleware, mounts routes, handles root navigation, and defines shared error handling. It also exports `createApp()`, which is an important maintainability and testing choice. Tests can instantiate the app directly instead of relying on a manually running server.

`config.js` centralizes runtime configuration. This improves maintainability by keeping environment-specific values such as host, port, database path, session secret, and bcrypt rounds in one place.

The database organization is clear. `database/schema.sql` defines schema, `database/setup.js` initializes the local database, `database/database.js` provides access helpers, and `database/migrations.js` supports incremental schema evolution. This is a strong fit for a SQLite-backed MVP.

Review outcome for code organization: Approved.

## 4. Business Logic Review

Story 1.1 intentionally contains limited business logic. This is the correct implementation choice. The foundation story should not implement package purchase rules, delivery rules, balance calculations, customer authorization, or dashboard metrics. Those belong to later stories.

The business logic review therefore focuses on whether the foundation provides the correct location and structure for later business logic. It does. The `models/` folder became the home for business-facing modules such as `cup-balance.js`, `package-purchase.js`, `delivery-history.js`, `dashboard.js`, `currency.js`, `customer-account.js`, `admin-user.js`, and `password.js`.

The delivered app confirms that business rules could be centralized later. Fixed VND pricing, bonus cup calculations, balance updates, multi-cup delivery checks, delivery voiding, and dashboard metrics were all added without replacing the foundation. This is strong evidence that Story 1.1 correctly avoided premature business-rule implementation while preparing the structure needed for it.

Review outcome for business logic: Approved.

## 5. UI/UX Review

The UI/UX responsibility of Story 1.1 was foundational. The story needed to make server-rendered views and static assets possible, not deliver the final visual experience.

The delivered foundation includes a `views/` folder and shared views for not-found and error states. This is appropriate because the application should provide predictable user-facing responses even during early development.

The delivered foundation also serves static assets from `public/`. This was important for later UI work. The current app now uses CSS and browser JavaScript for owner dashboard styling, customer detail behavior, package purchase previews, QR/share link controls, customer membership UI, progress display, notification bell behavior, low-balance alerts, and responsive layouts.

The UI approach is suitable for the product because the app is mostly form-driven and operational. A server-rendered approach with static assets keeps the MVP simple and maintainable. It also avoids introducing frontend build complexity that would not materially improve the owner workflow.

Review outcome for UI/UX: Approved.

## 6. Security Review

The security baseline in the foundation is appropriate for an MVP and supports later hardening.

`server.js` configures `express-session`, which is necessary for owner and customer authentication. Session cookies use `httpOnly`, `sameSite: 'lax'`, and a production-aware `secure` setting. The session secret is configurable through `config.js`. These decisions matter because later owner and customer sessions depend on this foundation.

The app also uses CSRF token middleware. This supports safer form workflows, which is important because the application uses server-rendered forms for owner operations such as customer creation, package purchase recording, delivery recording, delivery voiding, and password reset.

The foundation separates admin and customer route areas. Route separation is not full authorization by itself, but it makes later authorization middleware clear and maintainable. The delivered app later uses route guards to protect admin and customer routes.

Shared error handling helps avoid exposing raw implementation details to users. Errors are logged server-side and rendered through a shared error page.

Security concerns that remain beyond Story 1.1 are normal for later stories or production hardening. For example, authentication, password hashing, role checks, customer access tokens, and owner-managed password reset are implemented in later stories. Production deployment would still require a strong session secret and appropriate hosting configuration.

Review outcome for security: Approved for MVP foundation.

## 7. Data Integrity Review

The data integrity foundation is strong for the MVP.

SQLite is appropriate for the scale and operating model of the product. The app serves one shop with a small membership base, and the business needs local persistence rather than external database infrastructure. SQLite supports the required relational behavior while keeping setup low maintenance.

`database/database.js` enables foreign keys with `PRAGMA foreign_keys = ON`. This is essential because SQLite requires foreign key enforcement to be enabled per connection. Without this, relationships between admins, customers, package purchases, and deliveries could become inconsistent.

`database/schema.sql` includes relational tables, constraints, and indexes. The delivered schema supports admin users, customer accounts, package purchases, delivery history, and admin action logs. It includes uniqueness constraints, non-negative balance checks, valid package-size checks, positive delivery quantity checks, and indexes for common lookups.

`database/setup.js` provides repeatable local database initialization. This reduces the risk of manual schema errors. `database/migrations.js` provides a path for schema evolution, which proved useful as the delivered app gained token access and delivery voiding behavior.

Review outcome for data integrity: Approved.

## 8. Error Handling Review

The foundation includes appropriate baseline error handling.

Unknown routes are handled by a shared 404 page. This prevents users from seeing an unhelpful blank page or raw server output when they navigate to an invalid route.

Unhandled application errors are caught by a shared error handler. The handler logs the error server-side and returns a shared error page to the user. This is appropriate for the MVP because it balances developer visibility with user-facing restraint.

Database helper functions log failed SQLite operations with the SQL text and error message. This supports debugging during development. Route-level code in later stories should still translate database errors into user-appropriate messages, but the foundation provides useful low-level visibility.

The error handling approach is not overly complex. It matches the app's size and avoids adding a full observability stack before the product needs it.

Review outcome for error handling: Approved.

## 9. Test Coverage Review

Story 1.1 established the testability foundation by defining `npm test` and exporting `createApp()` from `server.js`. This was the most important test-related outcome for the foundation story.

The current delivered application has 30 passing automated tests. These tests cover much more than Story 1.1, but they are relevant evidence because they prove the foundation can support route-level and workflow-level testing. The suite covers admin authentication, route protection, customer management, package purchases, fixed VND pricing, bonus rules, delivery recording, delivery voiding, dashboard metrics, customer portal behavior, QR/shared links, notification rendering, and password reset.

For Story 1.1 specifically, ideal direct coverage includes route smoke tests, app creation tests, database setup validation, and foundation utility tests. Some of this coverage is indirectly exercised through later feature tests. The absence of a separate isolated "foundation-only" test file is not a blocker because the full test suite validates the foundation through real application workflows.

Review outcome for test coverage: Approved with minor observation that foundation-only smoke tests could be useful but are not required for acceptance.

## 10. Issues Found

No critical issues were found in the Story 1.1 foundation.

No high-severity issues were found in the Story 1.1 foundation.

Medium issue: The foundation relies on a development default session secret when `SESSION_SECRET` is not provided. This is acceptable for local development but must not be used for production.

Medium issue: Foundation-specific smoke tests are not separated as their own explicit story artifact in the current test suite. The foundation is well covered indirectly by later workflow tests, but a small dedicated smoke test could make future maintenance clearer.

Low issue: Database helper functions log SQL errors at a low level. This is useful for development, but production logging should be reviewed if the app is deployed publicly.

Low issue: The foundation uses server-rendered HTML and static assets, which is appropriate for the MVP, but future UI expansion should continue to avoid mixing client-side behavior with server-side business rules.

## 11. Fix Recommendations

Recommendation 1: Keep `SESSION_SECRET` documented as required for non-local environments. The current development default is acceptable for local use, but deployment documentation should continue to warn against using it in production.

Recommendation 2: Add or maintain a small foundation smoke test in future QA planning. The test should verify that `createApp()` returns an app, the root route redirects into the admin flow, static assets are available, and unknown routes return the shared 404 page.

Recommendation 3: Keep database access centralized. Future changes should continue using model modules and database helpers rather than adding direct database access in views or browser JavaScript.

Recommendation 4: Preserve the single-app route separation. Admin and customer functionality should remain separated through route modules and authorization middleware, not through separate applications.

Recommendation 5: If production deployment becomes a priority, review logging, session storage, secure cookie settings, and backup strategy for SQLite. These are not blockers for the MVP foundation but are appropriate future hardening topics.

## 12. Review Decision: Approved / Approved With Concerns / Changes Required

Review decision: Approved

The Story 1.1 implementation is approved as the application foundation for the Phase 1 Owner MVP.

The foundation is organized, maintainable, appropriately simple, testable, and aligned with the product's business constraints. It supports the delivered owner/admin portal, customer portal, QR/shared access flow, and automated test suite without requiring architectural replacement.

The minor observations identified in this review are not blockers. They are appropriate follow-up considerations for production hardening and future QA refinement, not reasons to reject the foundation story.
