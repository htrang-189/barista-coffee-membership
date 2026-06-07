# Development Objective

The objective of Story 2.2 was to convert the delivered owner authentication capability from a manually verifiable feature into a protected, repeatable, automated quality boundary. In business terms, this story exists to reduce the risk that later Phase 1 development could silently break owner login, weaken route protection, or compromise session behavior. Because the owner/admin portal is the operational center of the MVP, authentication failure is not a minor defect. It blocks customer management, package purchase recording, delivery tracking, and dashboard visibility. The delivered code for this story therefore focuses on implementation evidence for automated security regression coverage rather than new end-user functionality.

## Files Created

### `tests/admin-auth.test.js`

This file exists as the primary implementation output of the story. It solves the problem of unprotected authentication behavior by creating a dedicated automated suite for owner login, logout, password hashing, and admin route protection.

How it works:

- It uses the built-in Node test runner through `node:test`, which keeps the testing stack lightweight and consistent with the MVP’s low-maintenance architecture.
- It uses `supertest` to exercise the Express application at the HTTP boundary instead of testing only internal helper functions. This matters because the real authentication experience depends on forms, redirects, cookies, CSRF tokens, and session state.
- It creates a temporary SQLite database for test isolation, applies the production schema, seeds an admin user, builds the application instance, and then executes the authentication workflow tests against that isolated runtime.

This file is the clearest proof that the story was delivered as implemented code rather than as planning-only documentation.

## Files Modified

### `package.json`

This file provides the standardized test execution path used by the delivered application. It exists because test coverage only becomes operationally useful when it can be run consistently and easily.

Problem it solves:

- Without a canonical test command, authentication coverage would remain ad hoc and harder to enforce in daily development.
- A small MVP needs a low-friction path to run security checks locally.

How it works:

- The `scripts.test` entry is set to `node --test`.
- This allows `npm test` to execute the authentication suite alongside the broader application tests with no additional test runner configuration.

Although the file serves the entire project, it is part of the implementation evidence for this story because Story 2.2 depends on a standardized way to run owner-authentication regression checks.

## Database Changes

### No production schema changes

This story does not introduce or alter production database schema. That is an important aspect of the delivered design. The purpose of the story is to validate the existing owner authentication implementation, not to redefine it.

### Temporary isolated SQLite database during tests

The test suite creates a temporary SQLite database file at runtime.

Why it exists:

- To prevent tests from mutating the developer’s working application database.
- To guarantee deterministic test behavior regardless of local data state.
- To preserve the MVP principle of local simplicity without requiring an external database server.

What problem it solves:

- Shared database state creates flakiness and false results.
- Authentication tests need a controlled record set to validate session and credential behavior accurately.

How it works:

- `fs.mkdtempSync(...)` creates a temporary directory.
- A database file is created inside that directory.
- `database/schema.sql` is loaded and executed to apply the current schema.
- The database is opened using `openDatabase(...)`.
- After the tests complete, the database is closed and the temporary directory is removed.

This is a strong implementation choice because it keeps the test environment as close as possible to the real application architecture while preserving isolation.

## Routes Added

### No new application routes were added

Story 2.2 is a verification story, so it adds no new owner-facing or customer-facing routes. That is correct and expected. The value of the story comes from validating already delivered behavior, not from expanding the route surface.

### Routes exercised by the delivered implementation

The test suite exercises the following existing routes:

- `GET /admin/login`
- `POST /admin/login`
- `POST /admin/logout`
- `GET /admin/dashboard`

Why these routes are included:

- `GET /admin/login` provides the entry point and CSRF token required for form submission.
- `POST /admin/login` is the actual authentication boundary.
- `POST /admin/logout` is the session invalidation boundary.
- `GET /admin/dashboard` is the protected route used to prove authenticated and unauthenticated access behavior.

What problem this solves:

- It verifies the real owner workflow rather than assuming lower-level authentication helpers are sufficient proof.

How it works:

- The test suite uses `request.agent(app)` when session persistence between requests is required.
- Successful login is verified by checking redirect behavior and subsequent access to the dashboard.
- Unauthenticated access is verified by checking redirect behavior back to the login page with the expected session-expired message.

## Models Added

### No new models were added by this story

That is consistent with the story’s purpose. Story 2.2 validates existing model behavior rather than expanding the domain model.

### Existing models used by the tests

#### `models/admin-user.js`

This model is used in the delivered test suite through:

- `createAdminUser(...)`
- `findAdminByUsername(...)`

Why it exists in this story:

- The tests must seed a valid admin account using the same model path as the application.
- The tests must inspect stored admin data to verify that passwords are not persisted in plaintext.

What problem it solves:

- It ensures the tests are grounded in actual application behavior, not synthetic or bypassed credential state.

How it works:

- `createAdminUser(...)` creates the admin record using the application’s hashing logic.
- `findAdminByUsername(...)` retrieves the stored record so the suite can assert that `password_hash` is a bcrypt hash and not the raw password string.

## UI Components Added

### No new UI components were introduced

Story 2.2 does not change the owner login page, dashboard layout, or any visible admin interface. This is correct because the story’s scope is automated verification.

### Existing UI behavior verified by the tests

Even though no components were added, the tests validate critical rendered behavior:

- The login page renders a CSRF token input field.
- Invalid login responses render a generic `Invalid login` message.
- The authenticated owner can reach the dashboard page and receive the expected dashboard content.

Why this matters:

- Authentication is not purely backend logic. The owner interacts with forms and page flows.
- Verifying rendered HTML responses ensures that the delivered UI remains connected to the underlying security behavior.

How it works:

- The suite extracts the CSRF token directly from the rendered HTML.
- It asserts expected response content on both success and failure paths.

## Business Logic Implemented

### Security regression logic through automated assertions

The delivered business value of this story is expressed through automated assertions, not through new user-facing calculations or workflows.

#### Password hashing verification

Why it exists:

- Owner credentials must never be stored in plaintext.

What problem it solves:

- It prevents silent regressions where password persistence might become unsafe due to refactoring or future changes.

How it works:

- After seeding the admin account, the test loads the admin record and asserts that the stored `password_hash` begins with a bcrypt prefix and is not equal to the original password.

#### Login success verification

Why it exists:

- The owner must be able to access the admin portal with valid credentials.

What problem it solves:

- It protects the primary operational entry point of the MVP.

How it works:

- The suite fetches the login form, extracts the CSRF token, submits valid credentials, verifies redirect to `/admin/dashboard`, and then confirms the dashboard page is reachable in the same session.

#### Login failure verification

Why it exists:

- Invalid credentials must be rejected cleanly and safely.

What problem it solves:

- It prevents accidental authentication bypass and reduces information leakage through overly specific error messaging.

How it works:

- The suite submits the wrong password and asserts that the response returns an invalid-login message while not echoing the incorrect password value.

#### Route-protection verification

Why it exists:

- Admin-only pages must remain inaccessible to unauthenticated users.

What problem it solves:

- It protects the owner portal from accidental exposure caused by middleware regressions or route changes.

How it works:

- The suite requests `/admin/dashboard` without an authenticated session and asserts a redirect to `/admin/login?message=session-expired`.

#### Logout/session invalidation verification

Why it exists:

- Logging out must terminate the owner session immediately.

What problem it solves:

- It prevents stale authenticated sessions from retaining access after logout.

How it works:

- The suite authenticates an owner session, requests the dashboard to obtain a valid CSRF token, submits `/admin/logout`, verifies redirect to `/admin/login`, and then proves that the dashboard is no longer accessible afterward.

## Validation Rules

Story 2.2 does not add new domain validation rules, but it verifies existing security-critical validation behavior.

### CSRF token presence and use

Why it exists:

- The delivered authentication routes require CSRF-protected form submissions.

What problem it solves:

- It ensures that tests exercise the real request path rather than bypassing form protections.

How it works:

- The suite parses the CSRF token from rendered HTML and submits it with login and logout requests.

### Generic invalid-login messaging

Why it exists:

- Authentication failure responses should avoid unnecessary detail.

What problem it solves:

- It reduces the risk of credential or implementation detail leaking through error content.

How it works:

- The suite asserts the presence of a generic invalid-login message and the absence of the submitted incorrect password in the response body.

## Security Controls

This story directly validates several security controls already present in the application.

### Password hashing control

The suite proves that stored owner credentials are represented by hashes, not raw secrets.

### Session-based authentication control

The suite proves that successful login establishes an authenticated session that persists across requests when using the same agent.

### Route-protection middleware control

The suite proves that protected admin routes remain inaccessible without authentication.

### Session destruction on logout

The suite proves that logout invalidates the session and restores access restrictions immediately.

### Cookie/session boundary coverage

The suite implicitly validates the delivered session cookie workflow by verifying that authenticated access exists before logout and disappears afterward.

These controls matter because they protect the coffee shop owner’s administrative authority over all operational membership data.

## Test Coverage

The delivered Story 2.2 implementation includes the following automated tests in `tests/admin-auth.test.js`:

1. `admin password is stored as a bcrypt hash`
2. `admin login success creates a session and opens dashboard`
3. `admin login failure shows a generic error`
4. `unauthenticated admin route access redirects to login`
5. `logout clears the admin session`

Why this coverage exists:

- Together, these tests protect the minimal but essential owner-authentication security boundary for the MVP.

What problem it solves:

- It reduces the likelihood that later work in customer management, purchases, deliveries, or portal enhancements will unintentionally break admin access control.

How it works:

- Each test builds an isolated application/database context.
- Each test exercises the relevant route path or persistence check.
- Each test cleans up after itself by closing the SQLite connection and deleting the temporary database directory.

This coverage is appropriately scoped for the story. It does not try to test every admin feature; it tests the boundary that makes every admin feature safe to use.
