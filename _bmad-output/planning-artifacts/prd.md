# Product Requirements Document: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Final - Reconciled with Project Context

## 1. Overview

Barista Coffee Membership is a small authenticated web application for a single coffee shop. Admin users manage customer accounts, package purchases, bonus cup calculations, cup deliveries, and reports. Customers log in to view their own current balance, package history, and delivery history.

The Project Context is the primary source of truth for this PRD. Earlier assumptions about fixed 20-cup-only packages, public private links, and redemption terminology are superseded.

The implementation target is a simple full-stack JavaScript application using vanilla HTML/CSS/JavaScript on the frontend, Node.js with Express.js on the backend, and SQLite3 for persistence.

## 2. Goals

- Give admins a secure area for customer and balance management.
- Give customers a secure login for viewing their own balance and delivery history.
- Support only valid package sizes: 10, 20, and 30 cups.
- Apply fixed bonus cup rules accurately: 10->11, 20->22, 30->30.
- Record one-cup deliveries quickly during shop operations.
- Prevent delivery recording when customer balance is 0.
- Display current cup balance prominently.
- Display delivery history in reverse chronological order.
- Prevent duplicate customer account creation.
- Provide operational reporting for package revenue, bonus cups, deliveries, and outstanding cups.

## 3. Non-Goals

- POS integration.
- Payment processing.
- Loyalty campaigns, referrals, or marketing automation.
- QR codes or wallet passes.
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
- Fast delivery workflow: recording a delivered cup should be low-friction.
- Strong access separation: admin functions must never appear in customer interfaces.
- Simple operations: reports should support shop management without claiming accounting compliance.

## 6. Core Concepts

### 6.1 Customer Account

A customer account stores identity, login credentials, current cup balance, and contact details.

### 6.2 Package Purchase

A package purchase records the package size, bonus cups, total cups added, amount paid, admin actor, and timestamp.

### 6.3 Delivery

A delivery represents one cup served to a customer. Each delivery subtracts 1 cup and creates a delivery history record.

### 6.4 Current Balance

Current balance is the number of cups available to the customer. Package purchases increase the balance by total cups added. Deliveries decrease the balance by 1.

### 6.5 Admin And Customer Sessions

Admins and customers authenticate before accessing protected routes. Authorization is checked server-side.

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
- Store amount paid when entered.
- Store the admin user who recorded it.
- Store creation time.
- Add total cups to the customer's current balance.

The package purchase and balance update shall be saved in one database transaction.

### FR6: Bonus Cup Calculation

The system shall calculate package totals as:

```text
if packageSize === 10, totalCups = 11
if packageSize === 20, totalCups = 22
if packageSize === 30, totalCups = 30
```

The system shall store both `bonus_cups` and `total_cups_added`.

The system shall show package size, bonus cups, and total cups clearly before or during save.

The system shall reject invalid package sizes.

### FR7: Delivery Recording

The system shall allow admins to record one delivered cup for a customer.

The delivery shall:

- Subtract exactly 1 cup.
- Create a delivery history record.
- Store delivery date/time.
- Store the admin user who recorded it.
- Optionally store a note.
- Store balance after delivery.

The system shall prevent delivery recording when current balance is 0.

The delivery history insert and balance update shall be saved in one database transaction.

The system shall handle concurrent delivery attempts by rechecking balance inside the database transaction before updating the balance.

### FR8: Balance Display

The system shall display current cup balance prominently on admin customer detail and customer balance pages.

The system shall show a low balance warning when current balance is 5 cups or fewer.

The system shall never allow a delivery workflow to create a negative balance.

### FR9: Delivery History

The system shall show delivery history in reverse chronological order.

Admin delivery history shall show:

- Customer.
- Delivery date/time.
- Delivered cups.
- Balance after delivery.
- Admin actor.
- Note when present.

Customer delivery history shall show:

- Delivery date/time.
- Delivered cups.
- Balance after delivery.
- Note when appropriate.

### FR10: Customer Balance View

The system shall provide a customer-facing authenticated page.

The page shall show:

- Customer name.
- Current cup balance.
- Low balance warning when applicable.
- Package purchase history.
- Delivery history.

The page shall not allow delivery recording, package purchase recording, customer deletion, reporting access, or other admin operations.

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
- System shows bonus cups and total cups.
- 10-cup package adds 11 cups.
- 20-cup package adds 22 cups.
- 30-cup package adds 30 cups.
- Package purchase is saved.
- Customer balance increases by total cups.

### US5: Record Delivery

As an admin, I want to record one delivered cup so the customer's balance stays accurate.

Acceptance criteria:

- Admin can select a customer.
- System shows current balance before delivery.
- Admin can record one delivery.
- Delivery subtracts 1 cup.
- Delivery history row is created.
- Balance updates immediately.
- System blocks delivery if balance is 0.

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
- `amount_paid`: numeric value when recorded.
- `created_by_admin_id`: required reference to admin user.
- `created_at`: required.

### 9.4 Delivery History

Expected table name: `delivery_history`.

- `id`: unique identifier.
- `customer_id`: required reference to customer account.
- `delivered_cups`: required integer, fixed at `1`.
- `balance_after`: required integer.
- `note`: optional.
- `created_by_admin_id`: required reference to admin user.
- `delivery_date`: required.

## 10. Business Rules

- Only package sizes 10, 20, and 30 are allowed.
- A 10-cup package adds 11 total cups.
- A 20-cup package adds 22 total cups.
- A 30-cup package adds 30 total cups.
- Package purchase must update customer balance by total cups added.
- Delivery always subtracts exactly 1 cup.
- Delivery cannot be recorded when balance is 0.
- Customer balance cannot become negative.
- Low balance warning threshold is balance <= 5.
- Delivery history is shown in reverse chronological order.
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
- Admin functions must never be exposed in customer interface.
- HTTPS is required for all authentication pages in deployment.
- CSRF protection must be implemented for forms.
- Database operations must use prepared statements.
- Raw database errors must not be exposed to users.

## 14. Success Metrics

- Admin can create a customer account without duplicate confusion.
- Admin can record all valid package sizes with correct bonus cup totals.
- Admin can record a delivery during counter service with minimal friction.
- Delivery recording is blocked at 0 balance.
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
- Bonus rules are 10->11, 20->22, 30->30.
- Usage terminology is delivery and delivery history.
- Balance-changing package and delivery operations must use database transactions.
- Low balance threshold is 5 cups or fewer.

## 16. Future Considerations

These are not MVP requirements:

- POS/payment integration.
- QR code lookup.
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
