# Product Requirements Document: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Final - Reconciled with Current Implementation And QA Gate

## 1. Overview

Barista Coffee Membership is a small authenticated web application for a single coffee shop. Admin users manage customer accounts, package purchases, bonus cup calculations, cup deliveries, and reports. Customers log in to view their own current balance, package history, and delivery history.

The current working application and latest QA gate are the source of truth for this reconciled PRD. Earlier assumptions about narrower package handling, owner-entered package amounts, single-quantity delivery recording, and QR/share links being out of scope are superseded.

The implementation target is a simple full-stack JavaScript application using vanilla HTML/CSS/JavaScript on the frontend, Node.js with Express.js on the backend, and SQLite3 for persistence.

## 2. Goals

- Give admins a secure area for customer and balance management.
- Give customers a secure login for viewing their own balance and delivery history.
- Support only valid package sizes: 10, 20, and 30 cups.
- Apply fixed bonus cup rules accurately: 10->11, 20->22, 30->33.
- Record one or more delivered cups during shop operations.
- Prevent delivery recording when customer balance is 0.
- Prevent delivery recording when the requested quantity is greater than current balance.
- Allow admins to void mistaken deliveries, restoring cups without deleting history.
- Provide owner-generated QR/share balance links for read-only customer balance access.
- Display current cup balance prominently.
- Display delivery history in reverse chronological order.
- Prevent duplicate customer account creation.
- Provide operational reporting for package revenue, bonus cups, deliveries, and outstanding cups.

## 3. Non-Goals

- POS integration.
- Payment processing.
- Loyalty campaigns, referrals, or marketing automation.
- Wallet passes.
- Offline mode.
- Multi-shop or multi-branch support.
- Arbitrary package sizes outside 10, 20, and 30.
- Formal accounting, tax, or deferred revenue compliance.

## 4. Target Users

### 4.1 Admin / Shop Owner

The admin manages customer accounts, package purchases, deliveries, low-balance follow-up, and reporting. The admin has access to protected admin routes and all customer records.

### 4.2 Customer

The customer has an authenticated account and can view only their own current balance, package history, and delivery history.

## 5. Product Principles

- Correct balances first: package and delivery workflows must protect balance integrity.
- Clear bonus logic: users should see how total cups are calculated.
- Fast delivery workflow: recording delivered cups should be low-friction.
- Strong access separation: admin functions must never appear in customer interfaces.
- Simple operations: reports should support shop management without claiming accounting compliance.

## 6. Core Concepts

### 6.1 Customer Account

A customer account stores identity, login credentials, current cup balance, and contact details.

### 6.2 Package Purchase

A package purchase records the package size, bonus cups, total cups added, automatically calculated VND amount paid, admin actor, and timestamp.

### 6.3 Delivery

A delivery represents one or more cups served to a customer. Each delivery subtracts the delivered cup quantity and creates a delivery history record.

### 6.4 Current Balance

Current balance is the number of cups available to the customer. Package purchases increase the balance by total cups added. Deliveries decrease the balance by delivered cup quantity. Voiding a delivery restores the delivered quantity.

### 6.5 Admin And Customer Sessions

Admins and customers authenticate before accessing protected routes. Authorization is checked server-side.

### 6.6 Share Balance Link

Admins can generate and regenerate a secure customer-specific balance access token. The resulting share link and QR code open the same read-only balance information as the customer portal, hide payment amounts and admin actions, and do not allow mutations.

## 7. Functional Requirements

### FR1: Admin Authentication

The system shall provide admin login and logout.

The system shall protect `/admin/*` routes with authentication middleware.

The system shall verify admin authorization server-side before processing admin operations.

The system shall store admin passwords as bcrypt hashes.

The system shall use secure session configuration and clear the admin session on logout.

### FR2: Customer Authentication

The system shall provide customer login and logout.

The system shall protect `/customer/*` routes with authentication middleware.

The system shall ensure customers can only access their own account data.

The system shall store customer passwords as bcrypt hashes.

The system shall use secure session configuration and clear the customer session on logout.

### FR2A: Admin And Customer Route Separation

The system shall separate routes by function:

- `/admin/*` for admin operations.
- `/customer/*` for customer operations.

The system shall never expose admin functions, admin navigation, or admin-only data in the customer interface.

The system shall validate user permissions server-side for every protected operation.

### FR3: Admin Dashboard

The system shall provide an admin dashboard showing:

- Total customer accounts.
- Total outstanding cup balance.
- Total recorded package revenue.
- Total bonus cups granted.
- Total cups delivered.
- Low balance customers.
- Recent deliveries.

### FR4: Customer Account Management

The system shall allow admins to create customer accounts with:

- Name.
- Phone.
- Optional email.
- Login identifier.
- Initial password or password setup value.

The system shall prevent or clearly warn against duplicate customer account creation using phone or login identifier.

The system shall allow admins to view customer account details, package purchase history, delivery history, and current balance.

If customer deletion or other destructive customer-management actions are implemented, the system shall require a confirmation dialog before completing the action.

### FR5: Package Purchase Recording

The system shall allow admins to record a package purchase for a customer.

The package purchase shall:

- Require package size.
- Allow only package sizes `10`, `20`, or `30`.
- Calculate bonus cups using the approved rules.
- Calculate total cups added.
- Calculate amount paid automatically at `30.000 ₫` per purchased cup.
- Store `amount_paid_cents` from the calculated VND amount.
- Store the admin user who recorded it.
- Store creation time.
- Add total cups to the customer's current balance.

The package purchase and balance update shall be saved in one database transaction.

Payment collection remains outside the app. The app records calculated package revenue for operational reporting.

### FR6: Bonus Cup Calculation

The system shall calculate package totals as:

```text
if packageSize === 10, totalCups = 11
if packageSize === 20, totalCups = 22
if packageSize === 30, totalCups = 33
```

The system shall store both `bonus_cups` and `total_cups_added`.

The system shall show package size, bonus cups, and total cups clearly before or during save.

The system shall reject invalid package sizes.

### FR7: Delivery Recording

The system shall allow admins to record a positive integer delivered cup quantity for a customer.

The delivery shall:

- Default delivered cups to `1`.
- Allow only positive integer delivered cup quantities.
- Block delivery quantities greater than current balance.
- Subtract delivered cups from the current balance.
- Create a delivery history record.
- Store delivery date/time.
- Store the admin user who recorded it.
- Optionally store a note.
- Store balance after delivery.

The system shall prevent delivery recording when current balance is 0.

The delivery history insert and balance update shall be saved in one database transaction.

The system shall handle concurrent delivery attempts by rechecking balance inside the database transaction before updating the balance.

### FR7A: Void Delivery

The system shall allow admins to void a mistaken delivery.

Voiding a delivery shall:

- Restore the delivered cups to the customer's current balance.
- Mark the delivery as voided/cancelled.
- Preserve the delivery history record.
- Prevent voiding the same delivery twice.
- Exclude voided deliveries from delivered-cup dashboard totals.

### FR8: Balance Display

The system shall display current cup balance prominently on admin customer detail and customer balance pages.

The system shall show a low balance warning when current balance is 5 cups or fewer.

The system shall never allow a delivery workflow to create a negative balance.

### FR9: Delivery History

The system shall show delivery history in reverse chronological order.

History preview sections shall show the 5 most recent records by default and provide a `View All` action to dedicated full-history pages.

Admin delivery history shall show:

- Customer.
- Delivery date/time.
- Delivered cups.
- Balance after delivery.
- Admin actor.
- Note when present.
- Voided/cancelled state when applicable.

Customer delivery history shall show:

- Delivery date/time.
- Delivered cups.
- Balance after delivery.
- Note when appropriate.
- Voided/cancelled state when applicable.

### FR10: Customer Balance View

The system shall provide a customer-facing authenticated page.

The page shall show:

- Customer name.
- Current cup balance.
- Used cups.
- Time-of-day greeting.
- Member-since message.
- Cup consumption progress bar.
- Low balance warning when applicable.
- Notification bell with low-balance badge and notification popover when balance is 5 cups or fewer.
- Package purchase history.
- Delivery history.

The page shall not allow delivery recording, package purchase recording, customer deletion, reporting access, or other admin operations.

The customer-facing page shall show the 5 most recent package purchases and deliveries by default, with read-only full-history pages available through `View All`.

The customer-facing page shall use a premium coffee membership style with dark green and cream palette. Customer-facing pages shall not show payment amounts or admin actions.

### FR10A: Shared Balance Link

The system shall provide an owner-generated customer balance link and QR code.

The shared balance link shall:

- Use a secure token, not customer id or login identifier.
- Open a read-only customer balance page.
- Use the same customer membership UI as the authenticated customer balance page.
- Show only the linked customer's balance and history.
- Hide payment amounts.
- Hide admin navigation and admin actions.
- Include read-only full-history pages.
- Return 404 for invalid or regenerated tokens.

Admins shall be able to regenerate a customer's balance link, invalidating the previous token.

### FR11: Reporting

The system shall provide reports or dashboard metrics for:

- Total customer accounts.
- Total recorded package revenue.
- Package purchases by package size.
- Total bonus cups granted.
- Total cups added.
- Total cups delivered.
- Total outstanding cup balance.
- Low balance customers.
- Recent deliveries.

The system shall label revenue as recorded package revenue or equivalent wording to avoid implying accounting compliance.

### FR12: Error Handling And Validation

The system shall provide clear user-facing errors for:

- Invalid login.
- Missing required customer fields.
- Duplicate customer account.
- Invalid package size.
- Delivery attempt with 0 balance.
- Delivery quantity greater than balance.
- Invalid delivery quantity.
- Attempt to void an already-voided delivery.
- Database operation failure.

The system shall validate inputs server-side before database operations.

The system shall include client-side validation for usability, but shall not rely on client-side validation for security or business rule enforcement.

The system shall use prepared statements for database operations.

The system shall not expose raw database errors to users.

The system shall return consistent JSON responses for API-style operations:

```json
{"success": true, "data": {}, "message": ""}
```

or

```json
{"success": false, "data": {}, "message": "User-friendly error message"}
```

### FR13: Admin Action Logging

The system shall log admin actions that change customer data or balances.

Logged admin actions shall include:

- Customer account creation.
- Package purchase recording.
- Delivery recording.
- Customer account update.
- Destructive customer-management action when implemented.

Logs shall include enough context for debugging and audit review without exposing passwords or sensitive session data.

## 8. User Stories

### US1: Admin Login

As an admin, I want to log in so I can manage customers and balances securely.

Acceptance criteria:

- Admin can enter credentials.
- Valid credentials create an admin session.
- Invalid credentials show a clear error.
- Admin can log out.

### US2: Customer Login

As a customer, I want to log in so I can view my coffee balance and delivery history.

Acceptance criteria:

- Customer can enter credentials.
- Valid credentials open the customer balance page.
- Invalid credentials show a clear error.
- Customer can log out.

### US3: Create Customer Account

As an admin, I want to create a customer account so the customer can buy packages and log in.

Acceptance criteria:

- Admin can enter name and phone.
- Admin can enter optional email.
- Admin can set customer login credentials.
- Duplicate phone or login identifier is blocked or warned.
- Customer account appears in the admin customer list.

### US4: Record Package Purchase

As an admin, I want to record a package purchase so the customer's balance increases correctly.

Acceptance criteria:

- Admin can select package size 10, 20, or 30.
- Invalid package sizes are not accepted.
- System calculates amount paid at `30.000 ₫` per purchased cup.
- System shows bonus cups and total cups.
- 10-cup package adds 11 cups.
- 20-cup package adds 22 cups.
- 30-cup package adds 33 cups.
- Package purchase is saved.
- Customer balance increases by total cups.

### US5: Record Delivery

As an admin, I want to record delivered cup quantity so the customer's balance stays accurate.

Acceptance criteria:

- Admin can select a customer.
- System shows current balance before delivery.
- Admin can record a positive integer delivered cup quantity.
- Delivery subtracts delivered cup quantity.
- Delivery history row is created.
- Balance updates immediately.
- System blocks delivery if balance is 0.
- System blocks delivery quantity greater than balance.

### US5A: Void Delivery

As an admin, I want to void a mistaken delivery so customer balance can be corrected without deleting history.

Acceptance criteria:

- Admin can void a non-voided delivery.
- Voiding restores delivered cups to current balance.
- Voided delivery remains visible as voided/cancelled.
- Same delivery cannot be voided twice.
- Dashboard delivered-cup totals exclude voided deliveries.

### US6: View Admin Dashboard

As an admin, I want dashboard metrics so I can understand customer balances and shop activity.

Acceptance criteria:

- Dashboard shows total customer accounts.
- Dashboard shows total outstanding cups.
- Dashboard shows recorded package revenue.
- Dashboard shows bonus cups granted.
- Dashboard shows total cups delivered.
- Dashboard shows low balance customers.
- Dashboard shows recent deliveries.

### US7: View Customer Balance

As a customer, I want to view my account so I can see my current balance and delivery history.

Acceptance criteria:

- Customer balance is prominent.
- Low balance warning appears at 5 cups or fewer.
- Delivery history appears in reverse chronological order.
- Customer can see package history.
- Customer cannot access admin actions.

### US8: Use Shared Balance Link

As an admin, I want to share a QR/link balance view so customers can check their balance without full owner involvement.

Acceptance criteria:

- Admin can copy a customer balance link.
- Admin can show a QR code for the same link.
- Admin can regenerate the link.
- Regenerating invalidates the old token.
- Shared link opens a read-only page.
- Shared link hides payment amounts and admin actions.

## 9. Data Requirements

### 9.1 Admin User

Expected table name: `admin_users`.

- `id`: unique identifier.
- `username`: required, unique.
- `password_hash`: required.
- `role`: required.
- `created_at`: required.
- `updated_at`: required.

### 9.2 Customer Account

Expected table name: `customer_accounts`.

- `id`: unique identifier.
- `name`: required.
- `phone`: required, unique or duplicate-checked.
- `email`: optional.
- `login_identifier`: required, unique.
- `password_hash`: required.
- `balance_access_token`: required, unique secure token for shared read-only balance access.
- `current_balance`: required integer, default `0`.
- `created_at`: required.
- `updated_at`: required.

### 9.3 Package Purchase

Expected table name: `package_purchases`.

- `id`: unique identifier.
- `customer_id`: required reference to customer account.
- `package_size`: required integer enum: `10`, `20`, `30`.
- `bonus_cups`: required integer.
- `total_cups_added`: required integer.
- `amount_paid_cents`: calculated integer amount in cents, using `30.000 ₫` per purchased cup.
- `created_by_admin_id`: required reference to admin user.
- `created_at`: required.

### 9.4 Delivery History

Expected table name: `delivery_history`.

- `id`: unique identifier.
- `customer_id`: required reference to customer account.
- `delivered_cups`: required positive integer.
- `balance_after`: required integer.
- `note`: optional.
- `created_by_admin_id`: required reference to admin user.
- `delivery_date`: required.
- `voided_at`: optional timestamp when cancelled.
- `voided_by_admin_id`: optional reference to admin user who voided the delivery.

## 10. Business Rules

- Only package sizes 10, 20, and 30 are allowed.
- One purchased cup costs `30.000 ₫`.
- Package amount paid is calculated automatically from purchased cup count.
- A 10-cup package adds 11 total cups.
- A 20-cup package adds 22 total cups.
- A 30-cup package adds 33 total cups.
- Package purchase must update customer balance by total cups added.
- Delivery subtracts the entered positive integer delivered cup quantity.
- Delivery cannot be recorded when balance is 0.
- Delivery quantity cannot exceed current balance.
- Voiding a delivery restores delivered cups and preserves the history record.
- Customer balance cannot become negative.
- Low balance warning threshold is balance <= 5.
- Delivery history is shown in reverse chronological order.
- History previews show 5 recent records by default with `View All` full-history pages.
- Customer portal and shared balance links hide payment amounts and admin actions.
- Duplicate customer account creation must be prevented or explicitly warned.
- Admin and customer interfaces must remain separate.
- Customers cannot access admin functions.
- Authentication and authorization must be enforced server-side.
- Package purchase and delivery balance changes must be transactional.
- Concurrent delivery attempts must not allow overdrawing a customer's balance.

## 11. UX Requirements

- Current cup balance must be visually prominent.
- Bonus cup calculation must be shown clearly on package purchase flow.
- Admin delivery recording should be fast and clear.
- Zero-balance delivery attempts should show a clear warning.
- Low-balance status should be visible to admins and customers.
- Admin and customer navigation must be separate.
- Customer pages must not include admin actions.
- Errors should be near the relevant form field or action.
- Loading states should appear for database-backed operations.
- Destructive actions, when present, should require confirmation.

## 12. Reporting Requirements

The MVP shall provide:

- Total customer accounts.
- Total recorded package revenue.
- Package purchases by package size.
- Total bonus cups granted.
- Total cups added.
- Total cups delivered.
- Total outstanding cup balance.
- Low balance customers.
- Recent deliveries.
- Per-customer current balance.
- Per-customer delivery history.

## 13. Privacy And Security Requirements

- Admin and customer routes require authenticated sessions.
- Passwords must be stored with bcrypt.
- Sessions must be cleared on logout.
- Sessions must use secure configuration.
- Server-side middleware must enforce role access.
- Customer users can only view their own account data.
- Shared balance links load customer data by secure token only and render read-only views.
- Regenerating a balance access token invalidates the old shared link.
- Admin functions must never be exposed in customer interface.
- HTTPS is required for all authentication pages in deployment.
- CSRF protection must be implemented for forms.
- Database operations must use prepared statements.
- Raw database errors must not be exposed to users.

## 14. Success Metrics

- Admin can create a customer account without duplicate confusion.
- Admin can record all valid package sizes with correct bonus cup totals.
- Admin can record delivered cup quantity during counter service with minimal friction.
- Delivery recording is blocked at 0 balance.
- Delivery over current balance is blocked.
- Mistaken deliveries can be voided with balance restoration.
- Customers can log in and verify balance and delivery history.
- Reports show outstanding cups, delivered cups, package revenue, and bonus cups.
- Customers cannot access admin functions.

## 15. Resolved Product Decisions

- Project Context is the primary source of truth.
- Technical stack is vanilla frontend, Node.js/Express, and SQLite3.
- Customer accounts and login are required.
- Admin and customer interfaces are separate.
- Protected routes use `/admin/*` and `/customer/*`.
- Package sizes are limited to 10, 20, and 30.
- Bonus rules are 10->11, 20->22, 30->33.
- Fixed pricing is `30.000 ₫` per purchased cup, calculated automatically by the app.
- Usage terminology is delivery and delivery history.
- Deliveries support positive integer cup quantities and can be voided/cancelled.
- QR/share balance links are implemented as read-only token-based customer access.
- History preview sections show 5 recent records with `View All` full-history pages.
- Balance-changing package and delivery operations must use database transactions.
- Low balance threshold is 5 cups or fewer.

## 16. Future Considerations

These are not MVP requirements:

- POS/payment integration.
- Wallet passes.
- Customer self-service password recovery.
- Multi-shop support.
- Marketing automation.
- Accounting-grade reporting.
- Configurable bonus rules.
- Arbitrary package sizes.

## 17. Dependencies And Inputs

This PRD is based on:

- Project Context: `_bmad-output/project-context.md`
- Brainstorming Report: `_bmad-output/planning-artifacts/brainstorming-report.md`
- Research Findings: `_bmad-output/planning-artifacts/research-findings.md`
- Product Brief: `_bmad-output/planning-artifacts/product-brief.md`

## 18. Recommended Next Step

Use this reconciled PRD for UX, architecture, implementation, and test planning. Any future artifact that conflicts with Project Context or this PRD should be updated before development.
