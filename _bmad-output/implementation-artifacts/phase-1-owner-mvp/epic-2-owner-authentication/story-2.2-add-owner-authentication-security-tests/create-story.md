# Story Title

Story 2.2: Add Owner Authentication Security Tests

## Business Context

Phase 1 of the Barista Coffee Membership application gives a single coffee shop owner the ability to run the prepaid membership program through an authenticated admin portal. Once owner authentication and route protection are in place, the next business concern is not additional interface breadth, but reliability and safety of the access boundary itself. The owner portal contains operationally sensitive capabilities: customer creation, package purchase recording, balance management, delivery tracking, void handling, dashboard metrics, and customer access-link management. If authentication fails, becomes inconsistent, or regresses during later development, the owner could be blocked from operating the membership program or, worse, unauthorized users could reach protected admin pages.

This story exists to establish automated regression coverage around the most security-sensitive behaviors already delivered in Story 2.1. It converts the owner authentication capability from a manually verified feature into a protected capability with repeatable evidence. In business terms, this reduces operational risk for a small shop that depends on a simple, low-maintenance local web application rather than a staffed engineering or IT environment.

The completed application demonstrates that this test coverage became part of the delivery baseline. The owner authentication boundary is verified through automated tests that validate password hashing, successful login, failed login behavior, protected route redirects, and logout/session invalidation. This story therefore represents the transition from feature implementation to feature protection.

## User Story

As the coffee shop owner and as the project team responsible for maintaining the MVP,  
I want automated security-focused tests for owner authentication,  
so that login, logout, password handling, and protected route behavior remain trustworthy as the application evolves.

## Acceptance Criteria

1. Automated tests verify that owner passwords are stored as hashes and that plaintext passwords are not persisted.
2. Automated tests verify that an owner can log in successfully with valid credentials and reach a protected admin page.
3. Automated tests verify that invalid owner credentials do not authenticate the session and produce a generic error response.
4. Automated tests verify that unauthenticated access to protected admin routes is redirected to the owner login page.
5. Automated tests verify that owner logout destroys the authenticated session and re-protects admin routes immediately afterward.
6. Tests run through the project’s standard test command without requiring manual database setup.
7. The test suite uses isolated test data and does not depend on the developer’s working database file.
8. The tests preserve the MVP’s low-maintenance local development approach and do not introduce external infrastructure.

## Functional Requirements

1. The system shall include an automated route-level test suite for owner authentication behavior.
2. The test suite shall create or use an isolated SQLite test database during execution.
3. The test suite shall apply the current application schema before running authentication tests.
4. The test suite shall create a valid owner/admin account using the same password hashing path used by the delivered application.
5. The test suite shall submit an owner login request against the delivered login route and verify successful authentication behavior.
6. The test suite shall submit an owner login request with invalid credentials and verify that access is denied.
7. The test suite shall request protected admin routes without an authenticated session and verify redirect enforcement.
8. The test suite shall execute the owner logout flow and verify that subsequent protected-route access is blocked.
9. The test suite shall validate security-relevant behavior at the HTTP/session level rather than only testing internal helper functions in isolation.

## Non-Functional Requirements

1. The tests shall be deterministic and repeatable across local machines.
2. The tests shall not require any external database server, cloud service, or network dependency.
3. The tests shall complete within a reasonable local-development runtime consistent with a small Node/Express application.
4. The test design shall remain simple enough for a low-maintenance MVP and a small codebase.
5. The test suite shall be readable and maintainable so future changes to owner authentication can be verified quickly.
6. Security assertions shall focus on behavior that materially affects access control, session integrity, and password handling.

## UI Requirements

Although this is primarily a test-coverage story, it still has UI-facing validation implications because owner authentication is experienced through forms and route transitions.

1. The login flow under `/admin/login` shall remain the tested entry point for owner access.
2. A valid login shall route the owner into the protected admin experience rather than leaving the owner on the login page.
3. An invalid login shall preserve a safe, generic error experience and shall not expose technical or credential-specific detail.
4. Protected admin pages shall remain inaccessible to unauthenticated users, with redirect behavior consistent with the delivered admin workflow.
5. The logout flow shall return the owner to an unauthenticated state that is reflected in route access behavior.

No new visual components, layout changes, or styling changes are required by this story. The value of the story is verification of the delivered experience, not expansion of the UI surface.

## Database Requirements

1. No production schema change is required for this story.
2. The tests shall use the existing admin-user-related schema already delivered in the application.
3. The test harness shall create a temporary SQLite database file or equivalent isolated test database context.
4. The test harness shall apply the current schema before authentication tests execute.
5. Test data shall include at least one seeded owner/admin record with a hashed password.
6. Password persistence checks shall verify that the stored database value is a hash and not the raw password value.

## Technical Notes

1. The story is dependent on the owner authentication implementation already being in place, including:
   - password hashing utilities,
   - admin account lookup and authentication logic,
   - session-backed login/logout routes,
   - admin route protection middleware,
   - an application factory or equivalent testable server entry point.
2. The preferred testing approach is route-level verification using the current Node test runner and Supertest, because the business risk sits at the session and redirect boundary, not only inside pure functions.
3. The test harness should instantiate the application with an injected database connection or test configuration so the suite remains isolated from the local working database.
4. The test design should verify both positive and negative paths. Covering only successful login would be incomplete because the principal security risk is often in failure and boundary behavior.
5. Failure responses should be asserted in a way that preserves generic login messaging, since overly specific messages can create unnecessary information exposure.
6. Logout verification should include a follow-up protected route request to confirm that session invalidation is effective, not merely that the logout endpoint responds.

## Testing Requirements

The following automated tests are required:

1. A test proving that an owner password is stored in hashed form and not as plaintext.
2. A test proving that valid owner credentials authenticate successfully and allow access to protected admin functionality.
3. A test proving that invalid credentials do not authenticate the owner and return a generic invalid-login response.
4. A test proving that protected admin routes redirect unauthenticated requests to the login page.
5. A test proving that logging out invalidates the session and that protected routes are blocked afterward.

Testing execution requirements:

1. The tests must run via the standard project test command.
2. The tests must not mutate the local development database used for manual testing.
3. The tests must be isolated enough to support repeated execution in any order.
4. The tests must support future Phase 1 and Phase 2 work by serving as regression coverage around the shared authentication foundation.

## Definition of Done

This story is considered done when:

1. An automated owner-authentication security test suite exists in the project.
2. The suite verifies hashing, successful login, invalid login handling, protected-route enforcement, and logout/session invalidation.
3. The suite runs against isolated SQLite-backed test data rather than the live local development database.
4. The tests run successfully through the project’s standard test command.
5. The delivered test coverage provides clear regression protection for the owner authentication capability introduced earlier in Phase 1.
6. No new owner-facing business rules are introduced; the story strictly protects the already delivered authentication behavior.
7. The implementation remains aligned with the project’s low-maintenance, locally runnable MVP architecture.
