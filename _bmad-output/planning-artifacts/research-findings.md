# Research Findings: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Reconciled with Project Context

## Research Goal

Validate the Project Context direction: a single-shop coffee membership app with authenticated admin and customer areas, package sizes of 10, 20, and 30, fixed bonus cup rules, delivery tracking, current balance management, and operational reporting.

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

The Project Context narrows this product to a user-managed single-shop app. It does not need full POS or marketing automation, but it does require stronger authentication and account separation than a public balance lookup.

## Relevant Product Lessons

### 1. Customer Login Creates Clear Access Boundaries

The Project Context requires customer login flows. The customer experience should use authenticated customer accounts, not private public links.

MVP implication: customers must log in before seeing balance and delivery history.

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
- 30-cup package grants 30 total cups.

MVP implication: the UI should show the calculation clearly, and tests should cover all three scenarios.

### 5. Delivery History Is The Usage Record

The Project Context uses delivery terminology. A delivery represents one cup served to a customer and decreases the customer's balance by 1.

MVP implication: planning, UI, tests, and reports should use `delivery` and `delivery history`, not `redemption`.

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
- Duplicate account prevention.
- Simple operational reporting.

It should not compete with full POS, accounting, or marketing systems.

## Recommended Access Pattern

Use session-based login for both admin and customer areas.

- Admins log in before accessing `/admin/*`.
- Customers log in before accessing `/customer/*`.
- Passwords are hashed with bcrypt.
- Logout clears sessions.
- Middleware validates authenticated role before protected routes.
- Customers can only view their own account data.

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
- `current_balance`
- `created_at`
- `updated_at`

Recommended package purchase fields:

- `id`
- `customer_id`
- `package_size`
- `bonus_cups`
- `total_cups_added`
- `amount_paid`
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

## Product Risks

- Incorrect bonus cup calculation could create balance disputes.
- Duplicate customer accounts could split balances and delivery history.
- Weak session handling could expose customer or admin data.
- Concurrent delivery recording could overdraw a balance without database transactions.
- Admins may expect accounting-grade reporting from simple recorded package totals.

## Research Conclusion

The reconciled MVP should follow the Project Context: authenticated admin and customer flows, validated package sizes, fixed bonus cup rules, delivery history, transactional balance updates, and operational reporting. Earlier assumptions about private links, fixed 20-cup-only packages, and redemption terminology are superseded.
