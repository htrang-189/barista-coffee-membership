# Phase 2 Customer Portal: Full BMAD Retrospective Implementation Artifact

Date: 2026-06-05
Status: Implemented / Delivered
Artifact Type: Retrospective BMAD implementation history generated after delivery

## Phase

Phase 2 delivered the customer-facing read-only portal, shared QR/token access, customer history views, low-balance notifications, and polished coffee membership UI. It preserves owner-only control over customers, package purchases, deliveries, password resets, voiding, and balance-changing actions.

This artifact reconstructs the complete BMAD implementation history from the delivered system. It is not a forward-looking plan.

Regeneration scope: This file was regenerated as a detailed retrospective implementation artifact. Each delivered story is organized through the BMAD workflow stages `create-epics-and-stories`, `check-implementation-readiness`, `sprint-planning`, `create-story`, `dev-story`, `code-review`, `correct-course`, `investigate`, completion evidence, and final story status. The content reflects the current completed web application, including customer authentication, read-only portal access, QR/token sharing, UI polish, notification behavior, and browser-level QA.

---

## Epic 1: Customer Authentication

### Story P2-1: Customer Login And Logout

#### 1. Story Overview

Story title: Customer Login And Logout

Objective: Allow customers to access their own account using owner-created credentials.

Business value: Customers can self-check balances without contacting the owner.

#### 2. create-epics-and-stories

Original story definition: As a customer, I want to log in and out so I can view my own membership information.

Acceptance criteria:

- Customer login page exists.
- Valid credentials create a customer session.
- Invalid credentials show a generic error.
- Logout clears customer session.
- Password is verified using existing bcrypt hash.

Dependencies: Customer accounts created by owner in Phase 1.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- `customer_accounts` with login identifier and password hash.
- Customer auth model.
- Session middleware.

Architectural dependencies:

- `models/customer-account.js`
- `routes/customer.js`
- `views/shared/customer-login.html`
- `middleware/auth.js`

#### 4. sprint-planning

Implementation approach: Reuse existing customer credentials, add customer auth routes and customer login template.

Scope:

- Customer login.
- Customer logout.
- Customer session role.

Estimated effort: 1 development day.

Planned files/components:

- `routes/customer.js`
- `views/shared/customer-login.html`
- `models/customer-account.js`
- Tests.

#### 5. create-story

Final story specification: Implement customer authentication without adding customer self-service password reset.

Technical requirements:

- Verify password with bcrypt helper.
- Store session user as role `customer`.
- Generic login error.

UI requirements:

- Customer login form.
- No admin navigation.

Business rules:

- Customer cannot mutate membership records.

#### 6. dev-story

Implementation summary: Customer auth was added under `/customer/*`.

Files created:

- `routes/customer.js`
- `views/shared/customer-login.html`

Files modified:

- `models/customer-account.js`
- `middleware/auth.js`
- `server.js`
- `tests/customer-portal.test.js`

Routes:

- `GET /customer/login`
- `POST /customer/login`
- `POST /customer/logout`

Models:

- `authenticateCustomer`
- `findCustomerCredentialsByLoginIdentifier`

Views:

- Customer login page.

Database impact:

- Reads `customer_accounts.password_hash`.

#### 7. code-review

Validation performed:

- Login success/failure.
- Logout.
- Session redirect behavior.

Quality checks:

- Customer auth uses same password helper.

Security checks:

- No raw password logging/storage.
- Generic failure message.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Customer account credentials originally existed for later use; Phase 2 activated them.

Implementation adjustments:

- Added explicit role `customer`.

Design changes:

- Customer login uses member access language.

Scope corrections:

- Forgot-password flow intentionally excluded; owner reset handles forgotten passwords.

#### 9. investigate

Bugs encountered: None blocking.

Root cause analysis: Not applicable.

Debugging notes: Tests verify failed login does not create session.

Resolution: Not applicable.

#### 10. Completion Evidence

Implementation proof:

- Customer login route and model exist.

Route evidence:

- `/customer/login`, `/customer/logout`.

UI evidence:

- `views/shared/customer-login.html`.

Database evidence:

- Password hash comparison against `customer_accounts`.

Test evidence:

- `tests/customer-portal.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Epic 1 Summary

Customer authentication was delivered with session-based access and no self-service password reset.

### Epic 1 Deliverables

- Customer login/logout.
- Customer role sessions.
- Login tests.

---

## Epic 2: Customer Route Authorization

### Story P2-2: Customer/Admin Separation And Own-Data Access

#### 1. Story Overview

Story title: Customer/Admin Separation And Own-Data Access

Objective: Ensure customer routes expose only the logged-in customer's data and never admin actions.

Business value: Protects customer privacy and owner workflows.

#### 2. create-epics-and-stories

Original story definition: As a customer, I want to view only my own membership data.

Acceptance criteria:

- `/customer/balance` requires customer session.
- Customer full-history routes require customer session.
- Customer session cannot access `/admin/*`.
- Admin session cannot substitute for customer session.
- Customer data loads from session id.

Dependencies: Customer authentication.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Auth middleware.
- Session roles.

Architectural dependencies:

- `middleware/auth.js`
- `routes/customer.js`
- `routes/admin.js`

#### 4. sprint-planning

Implementation approach: Add `requireCustomer`, ensure routes use session identity, and test wrong-role access.

Scope:

- Customer route protection.
- Admin/customer session separation.
- Own-data loading.

Estimated effort: 0.5 development day.

Planned files/components:

- `middleware/auth.js`
- `routes/customer.js`
- Tests.

#### 5. create-story

Final story specification: Implement server-side customer authorization boundaries.

Technical requirements:

- `requireCustomer` middleware.
- `redirectAuthenticatedCustomer`.
- Session role check.
- No customer id route parameter for authenticated customer balance.

UI requirements:

- Customer portal omits admin nav and owner actions.

Business rules:

- Customer access is read-only.

#### 6. dev-story

Implementation summary: Customer/admin route separation was enforced.

Files created: None.

Files modified:

- `middleware/auth.js`
- `routes/customer.js`
- `tests/customer-portal.test.js`

Routes:

- Protected `/customer/balance`.
- Protected `/customer/package-history`.
- Protected `/customer/delivery-history`.

Models:

- `findCustomerById` using session id.

Views:

- Customer shell without admin navigation.

Database impact:

- Read-only customer data access.

#### 7. code-review

Validation performed:

- Unauthenticated redirect.
- Admin session rejected.
- Customer session rejected from admin.
- Customer cannot access mutation endpoints.

Quality checks:

- Authorization handled in middleware and route identity.

Security checks:

- Customer never controls customer id for authenticated data.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes: None.

Implementation adjustments: Added tests for customer session attempting admin route.

Design changes: Customer header kept separate from admin sidebar.

Scope corrections: Customer portal remains read-only.

#### 9. investigate

Bugs encountered: None blocking.

Root cause analysis: Not applicable.

Debugging notes: Negative route tests added.

Resolution: Not applicable.

#### 10. Completion Evidence

Implementation proof:

- `requireCustomer` middleware.

Route evidence:

- `/customer/balance` and history routes.

UI evidence:

- Customer pages lack admin navigation.

Database evidence:

- Data loaded by session id.

Test evidence:

- `tests/customer-portal.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Epic 2 Summary

Customer/admin separation and own-data access were delivered.

### Epic 2 Deliverables

- Customer auth middleware.
- Read-only protected customer route surface.
- Negative authorization tests.

---

## Epic 3: Read-Only Balance Portal And Histories

### Story P2-3: Customer Balance Overview

#### 1. Story Overview

Story title: Customer Balance Overview

Objective: Show remaining cups, used cups, and low-balance state to the authenticated customer.

Business value: Customer can self-check membership status.

#### 2. create-epics-and-stories

Original story definition: As a customer, I want to see my balance and used cups.

Acceptance criteria:

- Shows customer full name.
- Shows current balance.
- Shows used cups.
- Shows low-balance message at `<= 5`.
- Page is read-only.
- Payment amounts hidden.
- Admin actions hidden.

Dependencies: Customer auth and package/delivery data.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Customer auth.
- Package and delivery history models.

Architectural dependencies:

- `routes/customer.js`
- `views/customer/balance.html`

#### 4. sprint-planning

Implementation approach: Render customer balance from session customer id and compute used cups from non-voided deliveries.

Scope:

- Balance page.
- Current/used cups.
- Low-balance banner.

Estimated effort: 1 development day.

Planned files/components:

- `routes/customer.js`
- `views/customer/balance.html`
- CSS.
- Tests.

#### 5. create-story

Final story specification: Implement read-only customer balance page.

Technical requirements:

- Load customer by session.
- Query purchases/deliveries.
- Compute used cups.
- Escape rendered values.

UI requirements:

- Customer name.
- Remaining cups.
- Used cups.
- Low-balance banner.

Business rules:

- Customer cannot change any membership data.

#### 6. dev-story

Implementation summary: Balance page renders customer-safe information.

Files created:

- `views/customer/balance.html`

Files modified:

- `routes/customer.js`
- `public/css/styles.css`
- `tests/customer-portal.test.js`

Routes:

- `GET /customer/balance`

Models:

- Customer, package purchase, delivery history list functions.

Views:

- Customer balance page.

Database impact:

- Read-only queries.

#### 7. code-review

Validation performed:

- Customer balance page shows correct customer.
- Other customer data absent.
- Payment amounts absent.
- Admin actions absent.

Quality checks:

- Shared rendering helpers for history and notification blocks.

Security checks:

- Read-only route.
- Session identity only.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Customer UI later upgraded from simple balance view to membership-card design.

Implementation adjustments:

- Added used/remaining progress bar.

Design changes:

- Premium coffee membership visual style.

Scope corrections:

- No customer mutation endpoints added.

#### 9. investigate

Bugs encountered:

- Raw placeholders appeared during intermediate template updates.

Root cause analysis:

- Template replacement did not clear all placeholder tokens.

Debugging notes:

- Tests added for absence of raw placeholders.

Resolution:

- Template render fallback removes unreplaced `{{...}}` tokens.

#### 10. Completion Evidence

Implementation proof:

- `renderCustomerBalancePage`.

Route evidence:

- `/customer/balance`.

UI evidence:

- Browser QA screenshots.

Database evidence:

- Read-only customer/package/delivery queries.

Test evidence:

- `tests/customer-portal.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Story P2-4: Package And Cup History With View All

#### 1. Story Overview

Story title: Package And Cup History With View All

Objective: Show compact customer-safe history previews and full histories.

Business value: Customer can understand balance changes without seeing payment/admin data.

#### 2. create-epics-and-stories

Original story definition: As a customer, I want to see package and cup history.

Acceptance criteria:

- 5 most recent package records on balance page.
- 5 most recent delivery records on balance page.
- View All opens full-history pages.
- Full histories newest first.
- Payment amounts hidden.
- Admin actions hidden.

Dependencies: Customer balance page.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Package/delivery history models.
- Customer auth.

Architectural dependencies:

- `routes/customer.js`

#### 4. sprint-planning

Implementation approach: Reuse model queries and render customer-safe history rows with limited previews.

Scope:

- Package history preview.
- Delivery history preview.
- Full-history routes.

Estimated effort: 1 development day.

Planned files/components:

- `routes/customer.js`
- `views/customer/balance.html`
- Tests.

#### 5. create-story

Final story specification: Implement customer-safe history views.

Technical requirements:

- Slice previews to 5.
- Full-history routes use same customer session identity.
- Hide amount fields.

UI requirements:

- Package history card.
- Cup history card.
- View All links.

Business rules:

- Customer histories are read-only.

#### 6. dev-story

Implementation summary: Customer history previews and full-history pages were delivered.

Files created: None beyond customer balance template.

Files modified:

- `routes/customer.js`
- `views/customer/balance.html`
- `tests/customer-portal.test.js`

Routes:

- `GET /customer/package-history`
- `GET /customer/delivery-history`

Models:

- `listPackagePurchasesForCustomer`
- `listDeliveriesForCustomer`

Views:

- Customer balance history sections.
- Customer full-history shell.

Database impact:

- Read-only history queries.

#### 7. code-review

Validation performed:

- Preview count.
- Full count.
- Newest first.
- No payment/admin data.

Quality checks:

- History rendering helpers reused for authenticated and shared views.

Security checks:

- Session identity enforced.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Unlimited lists changed to preview + View All.

Implementation adjustments:

- Added full-history routes.

Design changes:

- Customer history cards refined.

Scope corrections:

- No edit/delete actions in customer histories.

#### 9. investigate

Bugs encountered: None blocking.

Root cause analysis: Not applicable.

Debugging notes: Tests count visible records.

Resolution: Not applicable.

#### 10. Completion Evidence

Implementation proof:

- Customer history render functions.

Route evidence:

- `/customer/package-history`, `/customer/delivery-history`.

UI evidence:

- History cards and View All links.

Database evidence:

- Package/delivery list queries.

Test evidence:

- `tests/customer-portal.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Epic 3 Summary

The read-only customer portal and histories were delivered.

### Epic 3 Deliverables

- Customer balance page.
- Package history.
- Cup history.
- Preview limits and View All.

---

## Epic 4: Shared QR/Token Balance Access

### Story P2-5: Token-Based Shared Balance Link

#### 1. Story Overview

Story title: Token-Based Shared Balance Link

Objective: Let customers view read-only balance through an owner-shared private link.

Business value: Customer can access balance without remembering login credentials.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want to share a secure balance link with a customer.

Acceptance criteria:

- Each customer has one secure token.
- Token generated for new customers.
- Missing tokens backfilled.
- Valid token renders read-only page.
- Invalid token returns 404.
- Shared page hides payment amounts and admin actions.

Dependencies: Customer account and balance renderers.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- `balance_access_token`.
- Customer balance rendering.

Architectural dependencies:

- `models/customer-account.js`
- `routes/customer.js`

#### 4. sprint-planning

Implementation approach: Add token generation/find methods and shared read-only routes using same safe render path.

Scope:

- Token generation.
- Shared balance route.
- Shared history routes.
- Invalid-token handling.

Estimated effort: 1 development day.

Planned files/components:

- `models/customer-account.js`
- `routes/customer.js`
- Tests.

#### 5. create-story

Final story specification: Implement bearer-token read-only customer balance access.

Technical requirements:

- Generate random token.
- Store unique token.
- Lookup customer by token.
- No login required for shared route.

UI requirements:

- Same customer membership page.
- No logout action on shared page.

Business rules:

- Shared page read-only.
- Payment amounts/admin actions hidden.

#### 6. dev-story

Implementation summary: Shared token access was implemented under `/customer/access/:token`.

Files created: None.

Files modified:

- `models/customer-account.js`
- `routes/customer.js`
- `database/migrations.js`
- `tests/customer-portal.test.js`

Routes:

- `GET /customer/access/:token`
- `GET /customer/access/:token/package-history`
- `GET /customer/access/:token/delivery-history`

Models:

- `findCustomerByBalanceAccessToken`
- `generateBalanceAccessToken`
- `backfillMissingBalanceAccessTokens`

Views:

- Reuses customer balance page rendering.

Database impact:

- Uses `customer_accounts.balance_access_token`.

#### 7. code-review

Validation performed:

- Valid token works.
- Invalid token 404.
- Shared page hides payment/admin actions.
- Full shared histories read-only.

Quality checks:

- Shared and authenticated pages share render helpers.

Security checks:

- Token route does not expose login identifier/payment/admin actions.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- QR/share links moved from out-of-scope to delivered enhancement.

Implementation adjustments:

- Added token backfill migration.

Design changes:

- Shared page uses same customer UI.

Scope corrections:

- No separate app/database.

#### 9. investigate

Bugs encountered: None blocking.

Root cause analysis: Not applicable.

Debugging notes: Old token invalidation tested after regeneration.

Resolution: Not applicable.

#### 10. Completion Evidence

Implementation proof:

- Token model and routes.

Route evidence:

- `/customer/access/:token`.

UI evidence:

- Shared balance screenshots.

Database evidence:

- `balance_access_token`.

Test evidence:

- `tests/customer-portal.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Story P2-6: Owner QR And Link Controls

#### 1. Story Overview

Story title: Owner QR And Link Controls

Objective: Provide owner controls to copy, show QR, and regenerate shared balance links.

Business value: Owner can manage customer access at the counter.

#### 2. create-epics-and-stories

Original story definition: As the owner, I want to generate a shareable customer balance link and QR code.

Acceptance criteria:

- Customer detail shows shareable link.
- Copy link button exists.
- QR code encodes secure balance link.
- Regenerate link button exists.
- Regeneration invalidates previous token.

Dependencies: Shared token access.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Token route.
- Admin customer detail.
- QR dependency.

Architectural dependencies:

- `routes/admin.js`
- `qrcode`
- `public/js/admin.js`

#### 4. sprint-planning

Implementation approach: Add access link section to customer detail and regenerate route.

Scope:

- Copy link UI.
- QR card.
- Regenerate token route.

Estimated effort: 1 development day.

Planned files/components:

- `routes/admin.js`
- `public/js/admin.js`
- Tests.

#### 5. create-story

Final story specification: Implement owner-managed shared access controls.

Technical requirements:

- Build absolute URL from request origin.
- QR encodes URL.
- Regenerate token server-side.

UI requirements:

- Compact readonly input.
- Copy link button.
- Show QR code button.
- Regenerate link button.

Business rules:

- Regenerated token invalidates old link.

#### 6. dev-story

Implementation summary: Owner link controls and QR generation were added to customer detail.

Files created: None.

Files modified:

- `routes/admin.js`
- `public/js/admin.js`
- `tests/customer-portal.test.js`

Routes:

- `POST /admin/customers/:customerId/balance-link/regenerate`

Models:

- `rotateCustomerBalanceAccessToken`

Views:

- Customer detail access link card.

Database impact:

- Updates `customer_accounts.balance_access_token`.

#### 7. code-review

Validation performed:

- Link visible.
- QR SVG present.
- Old token 404 after regeneration.
- New token works.

Quality checks:

- Copy status feedback implemented client-side.

Security checks:

- Regeneration admin-only.
- Shared token remains bearer secret.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Owner access link controls added after initial customer portal implementation.

Implementation adjustments:

- Improved UI from long URL block to compact input/button layout.

Design changes:

- QR card layout cleaned up.

Scope corrections:

- No payment or ordering functionality added.

#### 9. investigate

Bugs encountered:

- Initial copy/link section was visually messy.

Root cause analysis:

- Long URL rendered as large block and button styling stretched.

Debugging notes:

- UI request limited changes to access section.

Resolution:

- Compact readonly input and normal-sized action buttons.

#### 10. Completion Evidence

Implementation proof:

- QR/link controls on customer detail.

Route evidence:

- Regenerate route.

UI evidence:

- Customer detail browser screenshot.

Database evidence:

- Token value changes after regeneration.

Test evidence:

- `tests/customer-portal.test.js`.

#### 11. Story Status

Implemented.

Delivered.

### Epic 4 Summary

Shared QR/token access was delivered without creating a separate app or mutating customer data.

### Epic 4 Deliverables

- Secure token.
- Shared balance route.
- Shared histories.
- Owner link/QR controls.
- Token regeneration.

---

## Epic 5: Customer UI Polish And Notifications

### Story P2-7: Premium Membership UI

#### 1. Story Overview

Story title: Premium Membership UI

Objective: Make customer portal feel like a modern coffee membership experience.

Business value: Customer-facing experience builds confidence and reduces confusion.

#### 2. create-epics-and-stories

Original story definition: As a customer, I want a polished balance page that clearly shows my membership status.

Acceptance criteria:

- Cream background.
- Dark green membership hero card.
- Dynamic greeting.
- Member-since message.
- Large remaining-cups display.
- Used/remaining progress bar.
- Package/cup history cards align on desktop and stack on mobile.

Dependencies: Customer balance and histories.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Balance page template.
- Customer history data.

Architectural dependencies:

- `views/customer/balance.html`
- `public/css/styles.css`
- `public/js/admin.js`

#### 4. sprint-planning

Implementation approach: Redesign only customer/shared pages using existing data and routes.

Scope:

- Hero card.
- Balance panel.
- Progress bar.
- History cards.
- Responsive layout.

Estimated effort: 1-2 development days.

Planned files/components:

- `views/customer/balance.html`
- `public/css/styles.css`
- `public/js/admin.js`
- Browser QA.

#### 5. create-story

Final story specification: Implement customer-facing membership-card UI without changing business logic.

Technical requirements:

- Use existing route data.
- Client JS only for greeting.
- No schema/route logic changes.

UI requirements:

- Premium green/cream style.
- Time-of-day greeting.
- No remaining/used/status inside hero card.
- Responsive desktop/mobile.

Business rules:

- Read-only customer display.

#### 6. dev-story

Implementation summary: Customer and shared balance pages were redesigned around a membership hero and balance panel.

Files created: None.

Files modified:

- `views/customer/balance.html`
- `routes/customer.js`
- `public/css/styles.css`
- `public/js/admin.js`
- Tests.

Routes:

- `/customer/balance`
- `/customer/access/:token`

Models:

- No model logic changes.

Views:

- Customer balance template.

Database impact:

- None.

#### 7. code-review

Validation performed:

- Markup tests.
- Browser QA desktop/mobile.
- No raw placeholders.

Quality checks:

- Responsive constraints.
- History cards aligned.

Security checks:

- No admin actions/payment amounts exposed.

Review outcomes: Accepted.

#### 8. correct-course

Requirement changes:

- Hero wording and greeting evolved through multiple UI polish requests.

Implementation adjustments:

- Added dynamic greeting by time of day.
- Added progress bar below hero.

Design changes:

- Desktop web layout instead of mobile app frame.

Scope corrections:

- Business logic unchanged.

#### 9. investigate

Bugs encountered:

- Placeholder text appeared during intermediate template changes.

Root cause analysis:

- Missing replacement fallback.

Debugging notes:

- Added tests for raw placeholder absence.

Resolution:

- Template renderer strips unreplaced placeholders.

#### 10. Completion Evidence

Implementation proof:

- Customer balance template and CSS.

Route evidence:

- Customer and shared routes render same design.

UI evidence:

- Browser QA screenshots.

Database evidence:

- Existing data only.

Test evidence:

- `tests/customer-portal.test.js`.
- Browser QA screenshots.

#### 11. Story Status

Implemented.

Delivered.

### Story P2-8: Notification Bell And Low-Balance Messaging

#### 1. Story Overview

Story title: Notification Bell And Low-Balance Messaging

Objective: Make low/exhausted balance warnings visible and interactive.

Business value: Customers know when to buy a new package.

#### 2. create-epics-and-stories

Original story definition: As a customer, I want a notification when my balance is low.

Acceptance criteria:

- Bell appears top-right.
- Badge appears at balance `<= 5`.
- Critical state at balance `0`.
- Bell shakes briefly every 15 seconds.
- Clicking opens popover.
- Popover has low/exhausted message.
- Close/dismiss works.
- No email/SMS/push.

Dependencies: Customer UI.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Customer header.
- Balance value available in render function.

Architectural dependencies:

- `routes/customer.js`
- `public/css/styles.css`
- `public/js/admin.js`

#### 4. sprint-planning

Implementation approach: Render notification HTML from server, bind click behavior in JS, style CSS badge/popover/animation.

Scope:

- Notification bell.
- Badge.
- Popover.
- Low-balance and exhausted messages.
- Shake animation.

Estimated effort: 1 development day plus bug fixes.

Planned files/components:

- `routes/customer.js`
- `public/css/styles.css`
- `public/js/admin.js`
- Tests.
- Browser QA.

#### 5. create-story

Final story specification: Implement UI-only customer notifications.

Technical requirements:

- Stable data attributes.
- Bind after DOMContentLoaded.
- Fallback inline script for shared page.
- Periodic non-continuous animation.

UI requirements:

- Badge on low/zero balance.
- Popover with title/message.
- Close button.
- Low-balance banner preserved.

Business rules:

- Notification does not send email/SMS/push.
- Customer cannot mutate data.

#### 6. dev-story

Implementation summary: Notification bell, popover, CSS animation, and fallback binding were delivered.

Files created: None.

Files modified:

- `routes/customer.js`
- `public/css/styles.css`
- `public/js/admin.js`
- `tests/customer-portal.test.js`

Routes:

- Customer and shared balance routes.

Models:

- No model changes.

Views:

- Customer header notification HTML.

Database impact:

- None.

#### 7. code-review

Validation performed:

- Notification state low/critical.
- Popover content rendered.
- No placeholders.
- Browser click opened popover.

Quality checks:

- Lightweight CSS/JS.
- No external libraries.

Security checks:

- Read-only UI.
- No sensitive data exposed.

Review outcomes: Accepted after bug fixes.

#### 8. correct-course

Requirement changes:

- Bell initially badge-only; later required clickable popover.

Implementation adjustments:

- Added stable selectors and fallback script.

Design changes:

- Popover and close button added.

Scope corrections:

- No push/email/SMS added.

#### 9. investigate

Bugs encountered:

- Bell badge rendered but did not open message.
- Raw placeholders appeared during template changes.
- Browser QA initially hit stale port 3000 process with old markup.

Root cause analysis:

- Click handler binding and missing popover markup needed verification.
- Stale server process did not reflect current code.

Debugging notes:

- Inspected rendered DOM through Chrome DevTools.
- Restarted current-code server on port 3001 for QA.

Resolution:

- Added/rendered popover markup and fallback binding.
- Browser QA on current-code server passed.

#### 10. Completion Evidence

Implementation proof:

- `renderNotificationBell`.
- `bindNotificationBells`.

Route evidence:

- `/customer/balance`.
- `/customer/access/:token`.

UI evidence:

- Browser screenshots show bell/popover.

Database evidence:

- Uses existing balance value.

Test evidence:

- `tests/customer-portal.test.js`.
- Browser QA metrics.

#### 11. Story Status

Implemented.

Delivered.

### Epic 5 Summary

Customer UI polish and notification UX were delivered and browser-verified.

### Epic 5 Deliverables

- Membership hero.
- Balance panel.
- Progress bar.
- Responsive history cards.
- Notification bell and popover.

---

## Epic 6: Phase 2 QA And Browser Validation

### Story P2-9: Automated And Browser-Level QA

#### 1. Story Overview

Story title: Automated And Browser-Level QA

Objective: Verify customer portal and shared access workflows beyond route tests.

Business value: Customer-facing pages must be visually usable and secure.

#### 2. create-epics-and-stories

Original story definition: As the team, I want customer portal and shared link behavior tested end-to-end.

Acceptance criteria:

- Customer login/logout tested.
- Authorization tested.
- Shared link tested.
- Token regeneration tested.
- Notification rendering tested.
- Browser screenshots captured.
- No horizontal overflow.

Dependencies: All Phase 2 stories.

#### 3. check-implementation-readiness

Readiness assessment: Ready.

Prerequisites:

- Delivered app.
- Test data.
- Chrome available.

Architectural dependencies:

- Node test runner.
- `supertest`.
- Chrome headless DevTools for browser QA.

#### 4. sprint-planning

Implementation approach: Use route tests for behavior and browser screenshots/metrics for layout.

Scope:

- Automated tests.
- Browser QA screenshots.
- Layout bug fixes.

Estimated effort: 1 day.

Planned files/components:

- `tests/customer-portal.test.js`
- `tests/e2e-owner-customer-flow.test.js`
- Browser QA screenshot artifacts.

#### 5. create-story

Final story specification: Produce QA evidence for current feature set.

Technical requirements:

- `npm test`.
- Browser screenshots desktop/mobile.
- Metrics for overflow and pagination button widths.

UI requirements:

- Verify hero, notification, histories, pagination.

Business rules:

- Customer pages remain read-only.

#### 6. dev-story

Implementation summary: Tests and browser QA artifacts were produced; CSS layout issues were fixed.

Files created:

- `_bmad-output/implementation-artifacts/browser-qa-screenshots/*`
- `_bmad-output/implementation-artifacts/qa/current-feature-set-qa-summary.md`

Files modified:

- `tests/customer-portal.test.js`
- `tests/phase1-owner.test.js`
- `public/css/styles.css`

Routes:

- Admin/customer/shared routes exercised.

Models:

- All core models indirectly exercised.

Views:

- Admin and customer pages screenshot-tested.

Database impact:

- Local QA data seeded in `database/app.db`; no schema change.

#### 7. code-review

Validation performed:

- 30 automated tests.
- Browser screenshots desktop/mobile.
- No raw placeholders.
- No overflow.
- Notification popover opens.

Quality checks:

- Browser QA artifacts retained.

Security checks:

- Read-only shared/customer pages verified.

Review outcomes: PASS.

#### 8. correct-course

Requirement changes:

- Browser-level QA requested after route-level QA.

Implementation adjustments:

- CSS-only pagination and overflow fixes.

Design changes:

- Pagination compacted and centered.

Scope corrections:

- No route/page-size logic changed.

#### 9. investigate

Bugs encountered:

- Pagination button stretched/misaligned.
- Mobile horizontal overflow.
- Stale server process served old notification markup.

Root cause analysis:

- Flexible grid tracks and table wrapper constraints.
- Running server not restarted after code changes.

Debugging notes:

- Used Chrome headless DevTools screenshots and DOM metrics.

Resolution:

- CSS fixes.
- QA run against fresh current-code server.

#### 10. Completion Evidence

Implementation proof:

- QA summary and screenshots.

Route evidence:

- All requested admin/customer/shared pages captured.

UI evidence:

- Screenshot artifacts.

Database evidence:

- QA data exercised low-balance and pagination states.

Test evidence:

- 30 tests passing.
- Browser QA PASS.

#### 11. Story Status

Implemented.

Delivered.

### Epic 6 Summary

Phase 2 behavior and UI were verified through automated and browser-level QA.

### Epic 6 Deliverables

- QA summary.
- Browser screenshots.
- Layout fixes.
- Final PASS.

---

## Phase Retrospective

Phase 2 delivered customer self-service and shared read-only access while preserving owner-only control over mutations.

## Lessons Learned

- Browser QA is necessary for customer-facing UI.
- Shared pages should reuse the customer rendering path.
- Stale dev server processes can create false negatives during manual review.
- Tests should check both security behavior and rendered placeholders.

## Scope Changes

- Customer login and shared token access both delivered.
- QR/share links moved into delivered scope.
- Customer UI polish expanded to hero, progress bar, greeting, and notifications.
- Browser QA added after route-level QA.

## Final Delivered Outcome

Phase 2 Customer Portal is complete and delivered.
