# Story 1.2: Customer Login Authentication

Phase: Phase 2: Customer Portal

Epic: Epic 1: Customer Access & Authentication

Output type: `epic.md`

Workflow context: BMAD create-epics-and-stories output

Status: Reconstructed retrospective planning artifact

## Business Objective

The business objective of Story 1.2 was to give customers a direct authenticated way to enter the customer portal using their own credentials, while keeping the portal isolated from the owner/admin experience.

The completed application shows that customer login is not a separate convenience layer. It is the formal customer authentication boundary that allows the portal to become a true user-facing experience rather than only a tokenized read-only page. Once customers can authenticate, the shop can give them access to balance, history, notifications, and future membership features in a controlled way.

## Epic Objective

Epic 1: Customer Access & Authentication exists to establish secure customer entry into the portal. Story 1.1 provides secure access links; Story 1.2 adds authenticated customer login/logout so customers can enter the portal with a persistent session and safely leave it when done.

The epic objective for Story 1.2 is to:

- authenticate the customer with valid credentials
- create a customer session distinct from the owner session
- support logout and session invalidation
- protect customer routes so they only open for the correct customer session
- keep the customer portal isolated from admin routes

## Story Objective

The objective of Story 1.2 was to implement customer login authentication and session handling.

Using the completed application as the source of truth, this includes:

- rendering a customer login form
- validating customer credentials against the stored password hash
- creating a customer session on successful login
- redirecting the customer to the read-only balance page after login
- allowing the customer to log out and clear the session
- rejecting unauthenticated or expired access to customer routes

## User Value

The primary user value is convenience and continuity.

Customers can log into the portal directly instead of relying only on a shared access link. That is useful when a customer returns later and wants to see their own membership balance or history in a normal authenticated session.

The owner also benefits because customer authentication gives the portal a real identity model and reduces reliance on manual link sharing. It makes the customer experience feel like a proper portal instead of a one-off view.

At the product level, this story completes the customer entry model. It turns the portal into a session-based experience that can support richer features with less friction.

## Acceptance Criteria

1. The customer can open a login page and submit login credentials.
2. Valid customer credentials create a customer session.
3. A successful login redirects the customer to the balance page.
4. Invalid credentials are rejected with a generic error message.
5. The customer can log out and clear the session.
6. Customer routes require a valid customer session.
7. Expired or missing customer sessions redirect to the customer login page.
8. The admin session cannot be used to access customer-only routes.
9. The customer session is distinct from the owner session.
10. Automated tests cover login, logout, and route protection.

## Dependencies

Story 1.2 depends on the secure access link foundation and the existing customer identity data.

Prerequisite dependencies:

- Phase 1 owner MVP foundation stories that established customer data and auth patterns
- Story 1.1: Secure Customer Access Links

Technical dependencies:

- customer password hash storage
- customer credential verification logic
- customer session management
- customer route protection middleware
- customer login and logout routes

Downstream dependencies:

- customer balance page
- customer package history and delivery history
- low-balance notifications
- customer portal navigation and session-aware behavior

## Risks

### Risk 1: Customer credentials are not validated correctly

If the login flow accepts invalid credentials, the customer portal becomes insecure.

Mitigation:
Verify the customer password against the stored hash before creating a session.

### Risk 2: Customer and owner sessions overlap

If the customer session is not isolated from the owner session, users could cross access boundaries.

Mitigation:
Use a distinct customer session role and enforce customer-only route protection.

### Risk 3: Expired sessions still open customer routes

If session state is not enforced consistently, a stale session could continue to access data.

Mitigation:
Redirect missing or expired sessions back to the customer login page.

### Risk 4: Logout does not actually clear access

If logout only hides the UI and does not clear the session, the portal remains accessible.

Mitigation:
Destroy the session and clear the session cookie on logout.

### Risk 5: Login failures expose too much information

If the error message reveals whether the username or password was wrong, the login flow becomes noisier and less safe.

Mitigation:
Use a generic invalid login message.

## Priority

Priority: High

This story is high priority because it establishes the direct customer authentication path. The portal cannot feel complete without a secure login/logout flow, and later customer-facing features depend on authenticated access.

## Success Metrics

The story is successful when the customer can sign in and out securely and only authenticated customer sessions can access customer routes.

Business-capability success metrics:

- customers can authenticate with their own credentials
- customers can log out cleanly
- customer-only routes stay protected

Quality metrics:

- invalid logins do not create sessions
- expired sessions are redirected appropriately
- the customer session remains distinct from the owner session

Delivered evidence in the current application includes:

- customer login and logout routes
- customer session protection middleware
- customer login tests
- customer route protection tests

## Success Criteria Traceability To Delivered Application

The completed application confirms that Story 1.2 should be understood as the authenticated session boundary for the customer portal.

Implemented evidence includes:

- customer login/logout routes in `routes/customer.js`
- customer authentication in `models/customer-account.js`
- customer route protection middleware in `middleware/auth.js`
- automated tests in `tests/customer-portal.test.js`

The current application therefore confirms that this story is the customer authentication foundation for the Phase 2 customer portal.
