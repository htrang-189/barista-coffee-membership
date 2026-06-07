# Story 2.1: Implement Owner Authentication And Route Protection

Phase: Phase 1: Owner MVP

Epic: Epic 2: Owner Authentication

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 2.1 was to make the owner portal safely operable by ensuring that only the coffee shop owner can access the `/admin/*` experience. Phase 1 is not a public self-service product. It is an owner-operated operational tool for maintaining customer balances, recording prepaid package purchases, logging delivered cups, correcting mistakes, and reviewing dashboard metrics. Because those capabilities directly affect customer value and revenue-adjacent records, the system needed a secure owner-only access boundary before the rest of the Phase 1 workflows could be considered production-usable, even at MVP scale.

In business terms, authentication is not a cosmetic feature. It is the control that prevents unauthorized use of the ledger. Without it, a passerby with access to the application could create customers, alter balances, record fake deliveries, or distort reporting. Story 2.1 therefore supports the business goal of replacing informal, spreadsheet-style tracking with a disciplined web application the owner can trust.

The completed application confirms that this was the right objective. The current app provides owner login and logout, maintains an authenticated session, and protects all admin routes behind owner authentication.

## Epic Objective

Epic 2: Owner Authentication exists to establish a secure operational boundary around the admin portal. The epic objective is to ensure that the coffee shop owner can sign in, stay signed in while using the owner workflows, sign out explicitly, and be prevented from unintentionally exposing the administrative surface to unauthenticated users.

Within that epic, Story 2.1 is the core delivery story because it brings together the full owner authentication capability:

- password hashing and verification
- admin user creation/readiness
- login and logout workflow
- session-backed route protection

Although some of these concerns were originally tracked as smaller technical stories, they together form one coherent business capability: secure owner access to the admin portal.

## Story Objective

The objective of Story 2.1 was to implement the complete owner authentication workflow and protect admin routes from unauthenticated access.

Using the delivered application as the source of truth, this objective includes:

- secure password hashing through `bcrypt`
- password verification during login
- admin account creation logic
- `GET /admin/login`
- `POST /admin/login`
- `POST /admin/logout`
- authenticated owner session handling
- redirect behavior for unauthenticated and already-authenticated users
- `requireAdmin` middleware for protected admin routes

This story is therefore a business-capability story, not just a utility story. The owner can only use the rest of the admin portal because this story was delivered.

## User Value

The direct user value belongs to the coffee shop owner.

The owner benefits because the application becomes a real operational tool rather than an unprotected local interface. Once authentication is in place, the owner can confidently use the admin portal to manage the membership program without the application implicitly trusting every visitor.

There is also indirect customer value. Customers trust the coffee shop to maintain accurate prepaid cup balances. That trust depends on the owner portal being protected from unauthorized or accidental misuse.

For the maintainers of the application, this story creates a reusable and understandable authentication structure. Password security, admin credential lookup, route protection, and session behavior are separated into clear layers, which makes later changes safer.

## Acceptance Criteria

1. The application must provide an owner login page at `GET /admin/login`.
2. The login page must be accessible to unauthenticated users.
3. Authenticated admin users visiting the login page must be redirected to `/admin/dashboard`.
4. The application must provide `POST /admin/login`.
5. Valid admin credentials must create an authenticated owner session.
6. Successful owner login must redirect to `/admin/dashboard`.
7. Invalid login attempts must not create an authenticated session.
8. Invalid login attempts must return a generic error message rather than exposing credential details.
9. The application must provide `POST /admin/logout`.
10. Logout must clear the authenticated owner session.
11. After logout, the owner must no longer be able to access protected admin routes without signing in again.
12. All protected owner routes under `/admin/*` must require an authenticated admin session.
13. Unauthenticated access to protected admin routes must redirect to `/admin/login?message=session-expired`.
14. Admin passwords must not be stored in plaintext.
15. Admin passwords must be hashed before being written to the database.
16. Owner authentication must verify submitted passwords against stored hashes rather than comparing plaintext strings.
17. Authentication logic must be separated from UI rendering concerns.
18. Route protection logic must be reusable across admin routes.

## Dependencies

Story 2.1 depended on the Phase 1 foundation and consolidated several earlier technical concerns into one business story.

Prerequisite dependencies:

- Story 1.1: Build Local Express And SQLite Foundation
  - required the application shell, route namespaces, and server startup model
- Story 1.2: Establish Configuration, Data Access, And Test Foundation
  - required configuration support, SQLite schema/setup, DB helpers, and test baseline

Archived micro-story dependencies absorbed into this consolidated story:

- Story 2.1: Add Password Hashing Utilities
- Story 2.2: Seed Or Create Initial Admin User
- Story 2.3: Implement Admin Login And Logout
- Story 2.4: Protect Admin Routes

Technical dependencies:

- `bcrypt`
- `express-session`
- `config.js` for `sessionSecret` and `bcryptRounds`
- `admin_users.password_hash`
- database access helpers

Downstream dependencies:

- Story 2.2: Add Owner Authentication Security Tests
- all owner workflows under `/admin/*`
- customer management
- package purchase recording
- delivery workflows
- dashboard access

## Risks

### Risk 1: Admin password is stored in plaintext

If plaintext password storage were used, anyone with access to the SQLite database file could recover the owner's real credential. This would be a severe and avoidable security defect.

### Risk 2: Unauthenticated access is allowed on admin routes

If route protection were missing or inconsistently applied, non-owners could access or manipulate customer and ledger data.

### Risk 3: Login errors expose sensitive details

If the login flow reported overly specific failures, it could leak whether a username exists or reveal other information useful for unauthorized access attempts.

### Risk 4: Authentication logic is scattered across layers

If password handling, session logic, and route protection were duplicated across multiple files without clear boundaries, the implementation would become difficult to review and maintain.

### Risk 5: Owner authentication is delivered in disconnected pieces

If hashing, login, logout, and route protection were documented and implemented only as isolated technical tasks, the project might lose sight of the fact that the owner needs one complete secure-access capability.

## Risk Mitigation Approach

The delivered application shows the intended mitigation pattern:

- `models/password.js` centralizes password hashing and verification.
- `models/admin-user.js` owns admin credential creation and authentication logic.
- `middleware/auth.js` centralizes route protection and redirect behavior.
- `routes/admin.js` owns login/logout HTTP flow and uses the lower-level modules rather than embedding all logic inline.
- sessions provide owner state across admin requests.
- invalid login responses are generic.

This keeps the story aligned with both maintainability and MVP-level security expectations.

## Priority

Priority: High

Story 2.1 is high priority because the rest of the Phase 1 owner workflows should not be considered safely usable without a protected owner-only surface. Customer management, package purchases, delivery recording, void actions, and dashboard access all depend on authentication.

This story also has sequencing importance. It must arrive before or alongside the broader owner workflows, because those workflows only make business sense when they are restricted to the coffee shop owner.

## Success Metrics

The success of Story 2.1 can be measured through both business and technical indicators.

Business-capability success metrics:

- the owner can sign in successfully
- the owner can sign out successfully
- unauthenticated users are prevented from using admin routes
- the owner can resume protected workflows after login

Security and implementation success metrics:

- stored admin credentials are bcrypt hashes, not plaintext
- login verifies against stored hashes
- invalid credentials do not produce authenticated sessions
- route protection redirects unauthenticated access consistently

Delivered evidence in the current application includes:

- `models/password.js`
- `models/admin-user.js`
- `middleware/auth.js`
- `routes/admin.js`
- `views/shared/admin-login.html`
- owner auth test coverage in `tests/admin-auth.test.js`

## Success Criteria Traceability To Delivered Application

The reconstructed story planning maps directly to the completed application.

Implemented evidence:

- `models/password.js`
  - password hashing and verification
- `models/admin-user.js`
  - admin lookup, creation, and authentication
- `middleware/auth.js`
  - `requireAdmin`
  - `redirectAuthenticatedAdmin`
- `routes/admin.js`
  - `GET /admin/login`
  - `POST /admin/login`
  - `POST /admin/logout`
  - protected admin route handlers
- `tests/admin-auth.test.js`
  - hashed-password validation
  - login success
  - login failure
  - protected-route redirect
  - logout session clearing

The current application therefore confirms that Story 2.1 was correctly treated as a single business-deliverable capability: owner authentication and route protection for the admin portal.
