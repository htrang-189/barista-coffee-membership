# Research Findings: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Reconciled with Current Implemented Web Application

## Research Goal

Validate the current product direction: a single-shop Express coffee membership web app with authenticated admin and customer areas, shared read-only customer balance links, package sizes of 10, 20, and 30, fixed VND pricing, fixed bonus cup rules, delivery tracking, current balance management, and operational reporting.

## Sources Reviewed

- Project Context: `_bmad-output/project-context.md`
- Comparable coffee membership, stored-value, and punch-card workflows.
- Customer account portal and password-based access patterns.
- Small business balance tracking and audit-history patterns.

## Market Pattern

Comparable tools often fall into these categories:

- POS-integrated gift cards.
- Digital loyalty or punch cards.
- Customer account portals.
- Stored-value balance systems.
- Admin dashboards for balances and activity history.

The current implementation narrows this product to a user-managed single-shop app. It does not need full POS or marketing automation, but it does require strong route separation, authenticated account access, and secure read-only shared balance links.

## Relevant Product Lessons

### 1. Customer Login And Shared Links Create Clear Access Boundaries

The current app supports customer login and owner-generated shared balance links. Customer login provides session-based access to the customer portal; shared links provide token-based read-only balance access.

MVP implication: customers can view balance and delivery history through authenticated `/customer/*` routes or read-only `/customer/access/:token` routes. Neither path allows customer mutations.

### 2. Admin And Customer Areas Must Be Separate

The Project Context requires separate `/admin/*` and `/customer/*` route areas, session checks, and server-side permission validation.

MVP implication: package purchase recording, delivery recording, customer management, and reporting belong only in the admin area.

### 3. Package Size Validation Is Core Business Logic

Only 10, 20, and 30 cup packages are valid.

MVP implication: package size validation must exist on the server and should also be reflected in the UI through constrained controls.

### 4. Bonus Cup Rules Must Be Explicit

The required package calculations are:

- 10-cup package grants 11 total cups.
- 20-cup package grants 22 total cups.
- 30-cup package grants 33 total cups.

MVP implication: the UI should show the calculation clearly, and tests should cover all three scenarios.

### 5. Delivery History Is The Usage Record

The current implementation uses delivery terminology. A delivery records a positive integer cup quantity served to a customer, decreases the customer's balance by that quantity, and can be voided by the owner when entered by mistake. Voiding restores the delivered cups and keeps the history record marked as voided.

MVP implication: planning, UI, tests, and reports should use `delivery` and `delivery history`; delivered-cup reporting should exclude voided deliveries.

### 6. Balance Updates Need Database Transactions

Recording a package purchase or delivery changes multiple pieces of data. The history record and balance update must succeed or fail together.

MVP implication: package and delivery workflows should use database transactions.

### 7. Reporting Should Be Operational

The app can show recorded package revenue and cup balances, but it should not claim formal accounting compliance.

MVP implication: reports should include:

- Total customer accounts.
- Total recorded package revenue.
- Package purchases by size.
- Total bonus cups granted.
- Total cups added.
- Total cups delivered.
- Total outstanding cup balance.
- Low balance customers.
- Recent deliveries.

## Recommended MVP Positioning

Barista Coffee Membership is an authenticated coffee package and delivery tracker for a single shop.

It should be optimized for:

- Secure admin and customer access.
- Correct bonus cup calculation.
- Fast delivery recording.
- Clear current balance display.
- Premium coffee membership UI with dark green/cream styling, time-of-day greeting, member-since message, cup progress bar, and notification bell.
- Owner-generated QR/share balance links that remain read-only.
- Duplicate account prevention.
- Simple operational reporting.

It should not compete with full POS, accounting, or marketing systems.

## Recommended Access Pattern

Use session-based login for both admin and customer areas.

- Admins log in before accessing `/admin/*`.
- Customers log in before accessing `/customer/*`.
- Shared balance links use `/customer/access/:token` and do not require login.
- Passwords are hashed with bcrypt.
- Logout clears sessions.
- Middleware validates authenticated role before protected routes.
- Customers can only view their own account data.
- Shared-link pages hide payment amounts, login identifiers, admin navigation, and mutation actions.

## Recommended Data Model

Recommended tables:

- `admin_users`
- `customer_accounts`
- `package_purchases`
- `delivery_history`

Recommended customer account fields:

- `id`
- `name`
- `phone`
- `email`
- `login_identifier`
- `password_hash`
- `balance_access_token`
- `current_balance`
- `created_at`
- `updated_at`

Recommended package purchase fields:

- `id`
- `customer_id`
- `package_size`
- `bonus_cups`
- `total_cups_added`
- `amount_paid_cents`
- `created_by_admin_id`
- `created_at`

Recommended delivery history fields:

- `id`
- `customer_id`
- `delivered_cups`
- `balance_after`
- `note`
- `created_by_admin_id`
- `delivery_date`
- `voided_at`
- `voided_by_admin_id`

## Product Risks

- Incorrect bonus cup calculation could create balance disputes.
- Duplicate customer accounts could split balances and delivery history.
- Weak session handling could expose customer or admin data.
- Concurrent delivery recording could overdraw a balance without database transactions.
- Admins may expect accounting-grade reporting from simple recorded package totals.

## Research Conclusion

The reconciled MVP should follow the current implementation: authenticated admin and customer flows, token-based shared read-only balance links, validated package sizes, fixed VND pricing, fixed bonus cup rules, delivery history with voiding, transactional balance updates, recent-history previews with full-history pages, premium customer membership UI, and operational reporting. Earlier assumptions about fixed 20-cup-only packages, manual amounts, one-cup-only delivery, and QR links being out of scope are superseded.
