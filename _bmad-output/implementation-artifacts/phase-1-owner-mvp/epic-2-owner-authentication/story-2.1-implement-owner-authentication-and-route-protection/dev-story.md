# Story 2.1: Implement Owner Authentication And Route Protection

Phase: Phase 1: Owner MVP

Epic: Epic 2: Owner Authentication

Output type: CODE

Workflow context: BMAD dev-story output

Status: Implemented / Delivered

## Development Objective

The development objective of Story 2.1 was to deliver a complete owner-access capability for the admin portal. This meant implementing secure credential handling, authenticated owner session behavior, login and logout workflows, and route protection for `/admin/*`.

This story matters because the admin portal controls the operational center of the application. The owner uses it to create customers, record purchases, record deliveries, void mistakes, and view the dashboard. If those capabilities were accessible without authentication, the system would not be a trustworthy operational ledger.

The completed application delivers this objective through a combination of password utilities, admin-user model behavior, route middleware, login/logout route handlers, and a login view.

## Implementation Summary

The delivered implementation is not a single function or route. It is a coordinated capability delivered across several layers:

- `models/password.js` provides password hashing and verification utilities using bcrypt.
- `models/admin-user.js` creates admin users securely and authenticates submitted credentials.
- `middleware/auth.js` provides reusable admin route protection and authenticated-user redirect behavior.
- `routes/admin.js` implements login, logout, and protected admin flows.
- `views/shared/admin-login.html` provides the server-rendered owner login interface.
- `tests/admin-auth.test.js` verifies the capability end to end through controlled test flows.

Together, these files ensure that only an authenticated owner can access the admin portal and that stored admin credentials are not kept in plaintext.

## Files Created

### `models/password.js`

Why it exists:

The application needed one authoritative module for password hashing and password verification. If password security logic were duplicated across routes or models, the implementation would become harder to review and more likely to drift.

What problem it solves:

It prevents plaintext password persistence and gives the rest of the app a reusable interface for secure credential handling.

How it works:

The file imports `bcrypt` and application configuration. It exposes:

- `hashPassword(password)`
- `verifyPassword(password, passwordHash)`

`hashPassword` uses `bcrypt.hash(password, config.bcryptRounds)`.

`verifyPassword` uses `bcrypt.compare(password, passwordHash)`.

This keeps cryptographic behavior centralized and reusable.

### `middleware/auth.js`

Why it exists:

The application needed reusable route guards rather than repeating access checks in every route handler.

What problem it solves:

It ensures protected admin routes consistently deny unauthenticated access and that authenticated admins are redirected appropriately from the login page.

How it works:

The file exposes:

- `requireAdmin`
- `redirectAuthenticatedAdmin`

`requireAdmin` checks `request.session.user` and verifies `role === 'admin'`. If the session is missing or not an admin, it redirects to:

- `/admin/login?message=session-expired`

`redirectAuthenticatedAdmin` prevents signed-in admins from revisiting the login page unnecessarily by redirecting them to:

- `/admin/dashboard`

## Files Modified

### `models/admin-user.js`

Why it exists in this story:

The admin-user model is where credential lookup, account creation, and authentication logic come together. Story 2.1 relies on it to convert the password utility into a complete owner authentication workflow.

What problem it solves:

It provides a single model layer for:

- finding an admin by username
- creating an admin securely
- authenticating submitted credentials

How it works:

The file imports the password utility:

```js
const { hashPassword, verifyPassword } = require('./password');
```

It implements:

- `findAdminByUsername(database, username)`
- `authenticateAdmin(database, username, password)`
- `createAdminUser(database, username, password)`

`authenticateAdmin` normalizes the username, loads the stored admin record, and verifies the submitted password using `verifyPassword`.

`createAdminUser` validates username and password presence, checks for existing admin records, hashes the password with `hashPassword`, and inserts the admin record with `password_hash`.

### `routes/admin.js`

Why it exists in this story:

The owner authentication capability becomes usable only when the HTTP layer exposes login and logout behavior and applies route protection to admin pages.

What problem it solves:

It connects the underlying credential and session logic to real owner-facing workflows.

How it works:

Relevant route behavior includes:

- `GET /admin/login`
  - renders the login page for unauthenticated users
  - redirects authenticated admins to `/admin/dashboard`
- `POST /admin/login`
  - verifies submitted credentials with `authenticateAdmin`
  - shows a generic error on failure
  - regenerates the session and stores authenticated user data on success
  - redirects successful logins to `/admin/dashboard`
- `POST /admin/logout`
  - requires an authenticated admin and valid CSRF token
  - destroys the session
  - clears the session cookie
  - redirects to `/admin/login`

Protected admin pages such as `/admin/dashboard` use `requireAdmin`.

### `server.js`

Why it exists in this story:

Owner authentication depends on session middleware and app-local database/session configuration.

What problem it solves:

It enables persistent authenticated owner access across multiple admin requests.

How it works:

The server configures `express-session` and supports `createApp(...)` so test code can instantiate an isolated app with controlled session and database values.

This makes the auth capability both usable in runtime and testable in isolation.

### `views/shared/admin-login.html`

Why it exists in this story:

The owner needs a real entry point into the protected admin portal.

What problem it solves:

It provides a clear, server-rendered login page for the owner and displays validation or session-expired messaging without exposing implementation details.

How it works:

The template accepts replacements for:

- `CSRF_TOKEN`
- `MESSAGE`
- `USERNAME`

It renders a username field, password field, and submit button, with the form posting to `/admin/login`.

## Database Changes

Story 2.1 did not require a schema redesign.

Why it exists as a story-level database concern:

The story changed how admin credentials are stored and verified, even though it did not create a new table.

What problem it solves:

It ensures the database stores secure credential representations rather than raw passwords.

How it works:

The implementation uses the existing `admin_users.password_hash` field. During admin creation, the raw password is transformed into a bcrypt hash before insertion. During login, the submitted password is compared to the stored hash rather than to a plaintext value.

Behavioral database effects:

- new admin records are stored with hashed credentials
- login reads the stored hash to verify access

## Routes Added

### `GET /admin/login`

Why it exists:

The owner needs a public entry route to authenticate into the admin portal.

What problem it solves:

Without this route, the owner would have no login surface and the rest of the admin portal could not be protected behind a sign-in boundary.

How it works:

The route renders the login view for unauthenticated users and redirects authenticated admins to `/admin/dashboard`.

### `POST /admin/login`

Why it exists:

The owner needs a route that submits credentials and establishes authenticated access.

What problem it solves:

It converts submitted username and password into a validated owner session.

How it works:

The route checks the CSRF token, authenticates the submitted credentials using `authenticateAdmin`, returns a generic failure state on invalid credentials, and regenerates the session before persisting the authenticated user.

### `POST /admin/logout`

Why it exists:

The owner needs an explicit way to terminate the authenticated session.

What problem it solves:

It prevents stale or unintended access after the owner chooses to leave the admin portal.

How it works:

The route requires an authenticated admin and valid CSRF token, destroys the session, clears the session cookie, and redirects to the login page.

## Models Added

### `models/password.js`

Why it exists:

The authentication capability needs a reusable cryptographic utility layer.

What problem it solves:

It prevents insecure password handling and avoids duplicating bcrypt behavior.

How it works:

It hashes passwords using `config.bcryptRounds` and verifies submitted credentials against stored hashes.

## UI Components Added

### Owner Login View

Why it exists:

Authentication is not complete without a user-facing entry point for the owner.

What problem it solves:

It gives the owner a clear way to sign in and displays generic failure messages and session-expired messages.

How it works:

The server injects tokenized values into `views/shared/admin-login.html`, which renders the login form and posts to `/admin/login`.

### Logout Action In Admin Layout

Why it exists:

Authenticated sessions need a visible exit path.

What problem it solves:

It allows the owner to end access explicitly rather than relying on browser close behavior or session expiry alone.

How it works:

The admin layout includes a logout form that posts to `/admin/logout` with a CSRF token.

## Business Logic Implemented

The story implements the core owner authentication business behavior for Phase 1.

Implemented business logic includes:

- admin passwords are hashed before storage
- admin usernames are normalized for lookup and creation
- empty username or password cannot authenticate
- valid credentials create an authenticated session
- invalid credentials return a safe failure state
- unauthenticated users are redirected away from admin pages
- authenticated admins are redirected away from the login page
- logout destroys the session and removes ongoing access

Why it exists:

The owner portal requires a trustworthy access boundary before it can manage ledger-critical workflows.

What problem it solves:

It ensures that only the owner can operate the admin portal and that the security model is applied consistently across the route surface.

How it works:

The capability is distributed across:

- secure password hashing and verification
- admin-user lookup and authentication
- session-backed auth state
- redirect-based route protection

These pieces work together to form one owner-access flow.

## Validation Rules

The story implements validation rules around owner credentials and auth flow state.

Implemented validation includes:

- admin username is required when creating an admin
- admin password is required when creating an admin
- username is normalized with trimming
- login fails safely if username or password is missing
- invalid credentials do not create a session
- protected routes require `role === 'admin'`

Why it exists:

Authentication must fail safely and predictably. Owner access should not depend on loosely validated input or ambiguous session state.

What problem it solves:

It prevents malformed or incomplete login attempts from creating undefined behavior and ensures admin route access depends on explicit authenticated state.

How it works:

The model and middleware layers enforce these rules before protected content is served.

## Security Controls

The story delivers the main Phase 1 security boundary for the owner portal.

Implemented security controls include:

- bcrypt password hashing
- bcrypt password verification
- configurable bcrypt work factor through `config.bcryptRounds`
- session-backed admin auth state
- session regeneration on successful login
- CSRF validation on login and logout posts
- route protection middleware for admin pages
- generic login failure messaging
- session destruction and cookie clearing on logout

Why it exists:

Owner workflows can change customer balances and operational records, so the admin portal needs a practical security baseline even in the MVP.

What problem it solves:

It reduces the risk of unauthorized access, insecure password persistence, and session misuse.

How it works:

The system hashes passwords before storage, verifies them securely at login, uses protected session state to track authenticated admins, and requires that state before serving protected routes.

## Test Coverage

The delivered owner authentication capability is covered by `tests/admin-auth.test.js`.

Implemented coverage includes:

- admin password is stored as a bcrypt hash
- stored password is not equal to the original plaintext password
- admin login success creates a session and opens the dashboard
- admin login failure shows a generic error
- unauthenticated admin route access redirects to login
- logout clears the admin session

Why it exists:

Authentication is too important to leave unverified. The tests provide evidence that the owner access boundary behaves correctly and safely.

What problem it solves:

They reduce regression risk in password storage, login flow, session creation, route protection, and logout behavior.

How it works:

The tests build an isolated temporary SQLite-backed app, create an admin user, exercise the login and logout routes with `supertest`, and assert the resulting redirects, page content, and stored credential behavior.

## Delivered Output

The delivered output of Story 2.1 is a complete owner authentication and route-protection capability.

Delivered implementation includes:

- `models/password.js`
- `models/admin-user.js`
- `middleware/auth.js`
- `routes/admin.js` login/logout handlers
- `views/shared/admin-login.html`
- protected admin route behavior
- auth verification tests in `tests/admin-auth.test.js`

The story is complete because the owner can log in securely, access protected admin routes through a valid session, log out, and be blocked from protected routes once unauthenticated again.
