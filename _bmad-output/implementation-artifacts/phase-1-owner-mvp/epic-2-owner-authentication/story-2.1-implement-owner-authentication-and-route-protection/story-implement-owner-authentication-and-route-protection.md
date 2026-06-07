# Story 2.1: Implement Owner Authentication And Route Protection

Phase: Phase 1: Owner MVP

Epic: Epic 2: Owner Authentication

Output type: `story-[slug].md`

Workflow context: BMAD create-story output

Status: Reconstructed retrospective story document

## Story Title

Implement Owner Authentication And Route Protection

## Business Context

The Barista Coffee Membership application is an owner-operated prepaid cup ledger. In Phase 1, the admin portal is the primary working surface for the coffee shop owner. Through that portal, the owner can create customer accounts, record package purchases, track current balances, log deliveries, void mistakes, and view business-operational metrics.

Because those capabilities directly affect customer value and operational records, the admin portal cannot be treated as an open interface. If the owner workflows were available without authentication, any person with access to the running application could manipulate balances, create false history, or distort the program's reporting. That would immediately undermine trust in the system and defeat the purpose of replacing spreadsheets or paper tracking with a web application.

This story therefore exists to deliver a secure owner-only access boundary around the admin portal. It is not only a login-screen story. It is the story that turns the owner portal into a controlled operational system by combining secure credential handling, owner session management, login and logout behavior, and route protection.

The completed application confirms this business context. The current implementation provides:

- secure password hashing and verification
- login and logout routes
- session-backed admin access
- protected `/admin/*` routes

## User Story

As the coffee shop owner,

I want to sign in securely to the admin portal and have all owner-only routes protected,

So that only I can manage customer balances, purchases, deliveries, and dashboard information.

## Acceptance Criteria

1. The application must provide an owner login page at `GET /admin/login`.
2. Unauthenticated users must be able to access the login page.
3. Authenticated admin users visiting the login page must be redirected to `/admin/dashboard`.
4. The application must provide `POST /admin/login`.
5. Valid admin credentials must create an authenticated session.
6. Successful admin login must redirect to `/admin/dashboard`.
7. Invalid admin credentials must not create an authenticated session.
8. Invalid login responses must present a generic error and must not reveal the password or other sensitive credential details.
9. The application must provide `POST /admin/logout`.
10. Logout must clear the authenticated session.
11. After logout, protected admin routes must no longer be accessible without signing in again.
12. Protected owner routes under `/admin/*` must require an authenticated admin session.
13. Unauthenticated access to protected admin routes must redirect to `/admin/login?message=session-expired`.
14. Admin passwords must not be stored in plaintext.
15. Admin passwords must be hashed before database storage.
16. Admin authentication must verify submitted passwords against stored hashes.
17. Password hashing and verification logic must be reusable and not embedded directly in route handlers.
18. Route protection logic must be reusable across the admin route surface.

## Functional Requirements

The story must implement secure owner authentication behavior for the admin portal.

The application must support an admin user model that can:

- find an admin by username
- create an admin with a hashed password
- authenticate a submitted username and password

The application must implement a password utility capable of:

- hashing a plaintext password using bcrypt
- verifying a plaintext password against a stored bcrypt hash

The application must support a login workflow in which:

- the owner submits username and password
- credentials are verified against stored admin data
- a successful login writes authenticated owner identity into the session
- a failed login returns a generic invalid-login result

The application must support a logout workflow in which:

- the authenticated owner session is destroyed or cleared
- subsequent requests to protected routes are treated as unauthenticated

The application must provide reusable route protection so that owner-only pages are not manually guarded with duplicated logic.

The application must also support redirect behavior for:

- unauthenticated users trying to access protected admin pages
- already-authenticated owners attempting to visit the login page again

## Non-Functional Requirements

The authentication implementation must be secure enough for the MVP and must avoid obvious credential-handling defects.

Passwords must not be stored in plaintext.

The implementation must use a standard password hashing library rather than custom cryptographic logic.

The hashing cost factor must be configurable through application configuration.

The authentication logic must be maintainable. Password logic, credential lookup logic, route protection logic, and HTTP request handling should remain separated into clear modules.

The login flow must not leak sensitive credential details in error output.

The solution must be easy to run locally and must not depend on external auth services, OAuth providers, or hosted identity infrastructure.

## UI Requirements

The application must provide a server-rendered owner login page.

The login UI must include:

- username input
- password input
- CSRF token field
- generic error state for invalid login attempts

The login page does not need advanced branding or complex interaction design. Its main requirement is clarity and correctness.

The admin layout must also support a logout action available to authenticated owners.

Protected owner pages do not need to display separate security panels, but their accessibility must depend on authentication status.

This story does not require customer-facing UI, QR access UI, or broader design changes outside the owner auth surface.

## Database Requirements

The story must use the existing admin credential storage structure and must not require schema redesign.

The admin record must store:

- username
- password hash
- role

The delivered schema supports this through `admin_users.password_hash`.

The story must ensure that the database persists only hashed credentials and never stores the owner's original plaintext password.

The story may create or reuse an initial admin user so that login can function in a real local environment.

No additional authentication tables are required for the MVP.

## Technical Notes

The completed application implements the story using:

- `models/password.js`
- `models/admin-user.js`
- `middleware/auth.js`
- `routes/admin.js`
- `views/shared/admin-login.html`
- `server.js`

The password helper provides:

- `hashPassword(password)`
- `verifyPassword(password, passwordHash)`

The admin-user model provides:

- `findAdminByUsername(database, username)`
- `authenticateAdmin(database, username, password)`
- `createAdminUser(database, username, password)`

The route-protection middleware provides:

- `requireAdmin`
- `redirectAuthenticatedAdmin`

The admin route layer provides:

- `GET /admin/login`
- `POST /admin/login`
- `POST /admin/logout`

The implementation also depends on:

- `express-session`
- `bcrypt`
- `config.sessionSecret`
- `config.bcryptRounds`

## Testing Requirements

The story must be validated with automated tests that demonstrate both security behavior and owner workflow behavior.

Required automated coverage includes:

1. Admin password is stored as a bcrypt hash.
2. Stored password must not equal the original plaintext password.
3. Valid admin login creates a session and grants access to the dashboard.
4. Invalid login attempt returns a generic error and does not authenticate the user.
5. Unauthenticated access to a protected admin route redirects to the login page.
6. Logout clears the session and prevents further access to protected admin routes without re-authentication.

The completed application provides this coverage in:

- `tests/admin-auth.test.js`

Testing should be executable through the standard project test command:

```sh
npm test
```

The tests may use a temporary SQLite database and a generated app instance for isolation, but the story itself does not require browser automation or external services.

## Definition of Done

Story 2.1 is done when the application has a working owner login page.

Story 2.1 is done when valid admin credentials can log in successfully.

Story 2.1 is done when invalid credentials fail safely.

Story 2.1 is done when owner sessions are created on successful login.

Story 2.1 is done when logout clears the owner session.

Story 2.1 is done when protected `/admin/*` routes reject unauthenticated access through redirect behavior.

Story 2.1 is done when passwords are stored as bcrypt hashes rather than plaintext.

Story 2.1 is done when route protection logic is reusable and consistently applied.

Story 2.1 is done when automated tests verify hashed-password storage, login success, login failure, protected-route redirects, and logout behavior.
