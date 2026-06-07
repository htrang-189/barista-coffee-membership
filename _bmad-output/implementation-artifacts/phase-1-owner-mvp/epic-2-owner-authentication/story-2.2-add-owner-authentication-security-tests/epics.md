# Story 2.2: Add Owner Authentication Security Tests

Phase: Phase 1: Owner MVP

Epic: Epic 2: Owner Authentication

Output type: `epics.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 2.2 was to provide evidence that the owner authentication boundary actually works as intended and continues to work as the application evolves. In Phase 1, the admin portal is the control center for the coffee membership ledger. The owner can create customers, record package purchases, log deliveries, void mistakes, and review dashboard metrics. If the owner authentication flow is broken, those operations become exposed or unreliable.

Because authentication is a high-risk surface, it is not enough to implement login and route protection once and assume they remain correct. The business needed automated checks that prove the owner's credentials are stored securely, that valid login works, that invalid login fails safely, that protected routes are not accessible without authentication, and that logout actually ends access.

The completed application demonstrates this objective through `tests/admin-auth.test.js`, which verifies the critical owner authentication behaviors in a controlled environment.

## Epic Objective

Epic 2: Owner Authentication exists to establish a secure access boundary around the `/admin/*` portal. Once Story 2.1 delivers the actual owner authentication and route-protection capability, the next epic objective is to validate that capability with focused automated tests.

Within the epic, Story 2.2 provides the assurance layer. It turns the owner authentication capability into a test-protected feature rather than a one-time implementation that could regress silently.

This matters because authentication defects often appear in small changes:

- a session redirect changes unexpectedly
- login failure handling becomes too permissive
- password storage regresses
- logout stops clearing access correctly

Story 2.2 exists to detect those failures before they affect the owner's ability to trust the system.

## Story Objective

The objective of Story 2.2 was to add focused automated security and workflow tests for owner authentication and route protection.

Using the completed application as the source of truth, the story validates:

- admin password is stored as a bcrypt hash
- stored password is not plaintext
- valid owner login creates a session and reaches the dashboard
- invalid owner login returns a generic failure
- unauthenticated admin route access redirects to login
- logout clears the session and restores protected-route redirects

This is a business-capability test story, not a general-purpose test story. Its purpose is to protect the owner authentication boundary specifically.

## User Value

The direct user value belongs to the coffee shop owner.

The owner benefits because the application's access control becomes verifiable rather than assumed. When the owner uses the admin portal to manage balances and deliveries, they can trust that authentication regressions are less likely to reach them unnoticed.

There is also product-level value for customers. When the owner portal remains properly protected, customer balances and purchase/delivery records are less likely to be exposed to unauthorized use or accidental misuse.

For maintainers, this story creates a focused regression suite for one of the most sensitive parts of the app. That makes future changes to auth behavior safer.

## Acceptance Criteria

1. Automated tests must verify that stored admin passwords are bcrypt hashes.
2. Automated tests must verify that stored admin passwords are not equal to the original plaintext password.
3. Automated tests must verify that valid owner login creates an authenticated session.
4. Automated tests must verify that successful owner login redirects to `/admin/dashboard`.
5. Automated tests must verify that invalid owner login fails with a generic error message.
6. Automated tests must verify that invalid login does not create authenticated access.
7. Automated tests must verify that unauthenticated access to a protected admin route redirects to `/admin/login?message=session-expired`.
8. Automated tests must verify that logout clears the authenticated session.
9. Automated tests must verify that, after logout, protected admin routes are no longer accessible without re-authentication.
10. Tests must run in isolated local test environments.
11. Tests must not depend on a shared long-lived database state.
12. Tests must be executable through the standard project test command.

## Dependencies

Story 2.2 depends directly on the delivery of Story 2.1.

Prerequisite dependencies:

- Story 1.1: Build Local Express And SQLite Foundation
- Story 1.2: Establish Configuration, Data Access, And Test Foundation
- Story 2.1: Implement Owner Authentication And Route Protection

Technical dependencies:

- Node test runner
- `supertest`
- temporary SQLite test setup
- `createApp(...)`
- `openDatabase(...)`
- `createAdminUser(...)`

The story also depends on a working owner auth capability consisting of:

- password hashing
- admin user creation
- admin login and logout routes
- route protection middleware
- CSRF token handling

Downstream dependencies:

- stable future changes to owner auth behavior
- safe expansion of owner workflows under `/admin/*`
- maintainable security regression protection

## Risks

### Risk 1: Authentication appears implemented but is unverified

If no focused auth tests exist, regressions in login, logout, or route protection may go unnoticed until the owner encounters them directly.

### Risk 2: Password storage regresses silently

If admin creation changes and accidentally stores plaintext or malformed hashes, the security boundary is compromised.

### Risk 3: Invalid login failures become too permissive or too revealing

If route or rendering behavior changes, invalid logins might authenticate incorrectly or reveal sensitive credential details.

### Risk 4: Protected routes become accessible without authentication

If middleware application changes or route guards are removed, admin pages may be exposed.

### Risk 5: Tests are not isolated

If auth tests depend on shared database state, they become flaky and harder to trust.

## Risk Mitigation Approach

The delivered application reflects the intended mitigation pattern:

- create an isolated temporary SQLite database for auth tests
- create a test admin user in that environment
- use `createApp(...)` with controlled dependencies
- exercise real login, protected-route, and logout flows with `supertest`
- assert both storage behavior and route behavior

This gives the project focused, reliable evidence that the owner authentication surface behaves correctly.

## Priority

Priority: High

Story 2.2 is high priority because authentication is one of the most sensitive parts of the application. Once Story 2.1 exists, Story 2.2 is the mechanism that turns it into a protected capability rather than a fragile implementation detail.

This story also has strong sequencing value. Testing the auth boundary early reduces risk before the owner spends time using the rest of the admin workflows.

## Success Metrics

The success of Story 2.2 can be measured in terms of both product assurance and technical reliability.

Product-assurance success metrics:

- the owner login boundary is covered by automated tests
- the protected admin surface is verified as inaccessible without authentication
- logout is verified to terminate access

Technical success metrics:

- password hashing storage is tested
- login success path is tested
- login failure path is tested
- route protection redirect behavior is tested
- tests run through the standard project test command

Delivered evidence in the current application includes:

- `tests/admin-auth.test.js`
- `package.json` test command
- temporary SQLite-backed auth test harness using `createApp`, `openDatabase`, and `createAdminUser`

## Success Criteria Traceability To Delivered Application

The reconstructed planning maps directly to the delivered auth test suite.

Implemented evidence:

- `tests/admin-auth.test.js`
  - `admin password is stored as a bcrypt hash`
  - `admin login success creates a session and opens dashboard`
  - `admin login failure shows a generic error`
  - `unauthenticated admin route access redirects to login`
  - `logout clears the admin session`

Supporting implementation evidence:

- `models/admin-user.js`
- `models/password.js`
- `middleware/auth.js`
- `routes/admin.js`
- `server.js`

The completed application therefore confirms that Story 2.2 delivered the intended business value: owner authentication is not only implemented, but continuously verifiable through focused automated security tests.
