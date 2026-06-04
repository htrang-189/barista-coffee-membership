# Technical Architecture: Barista Coffee Membership

Date: 2026-06-01
Project: barista-coffee-membership
Status: Draft - Reconciled with Current Implementation And QA Gate

## 1. Architecture Summary

Barista Coffee Membership is a small authenticated full-stack web application for a single coffee shop. It uses vanilla HTML/CSS/JavaScript on the frontend, Node.js v22.x with Express.js v4.x on the backend, SQLite3 for file-based persistence, bcrypt for password hashing, and express-session for admin/customer sessions.

The current working application and latest QA gate are the source of truth for this reconciled architecture. This architecture intentionally does not use Next.js, TypeScript, Tailwind, Prisma, or a ledger-only transaction model because those are superseded by the reconciled Project Context and implemented application.

The application is designed for low maintenance, simple local setup, low-cost deployment, and clear implementation by a small team.

## 2. Source Of Truth

Architecture inputs, in priority order:

1. `_bmad-output/project-context.md`
2. `_bmad-output/planning-artifacts/prd.md`
3. `_bmad-output/planning-artifacts/ux-design.md`
4. `_bmad-output/planning-artifacts/product-brief.md`

If these documents conflict, Project Context wins.

## 3. Technology Stack

- Frontend: vanilla HTML, CSS, JavaScript
- Backend: Node.js v22.x
- Web framework: Express.js v4.x
- Database: SQLite3 file database
- Authentication: bcrypt password hashes
- Sessions: express-session
- Deployment: Railway or Render as primary full-stack Node.js hosts
- Development environment: Kiro IDE or terminal

Key dependencies:

- `express`
- `sqlite3`
- `bcrypt`
- `express-session`
- `dotenv`
- `qrcode`

Recommended dev/test dependencies:

- `nodemon`
- `jest` or Node's built-in test runner
- `supertest` for route tests
- `eslint`
- `prettier`

## 4. Architectural Goals

- Keep the implementation simple and readable.
- Use one JavaScript codebase for frontend and backend.
- Avoid external database infrastructure.
- Keep SQLite setup easy for local development.
- Enforce admin/customer access separation server-side.
- Protect balance integrity with database transactions.
- Support package sizes `10`, `20`, and `30` only.
- Apply package credits exactly: `10 -> 11`, `20 -> 22`, `30 -> 33`.
- Calculate package revenue at `30.000 ₫` per purchased cup.
- Support multi-cup delivery recording and void/cancel correction.
- Support read-only QR/share balance links.
- Keep history previews compact with `View All` full-history pages.
- Support package purchase history, delivery recording, delivery history, and reporting.

## 5. Non-Goals

- No microservices.
- No separate frontend framework.
- No external database service for MVP.
- No POS integration.
- No payment processing.
- No wallet integration.
- No offline-first sync.
- No multi-shop or multi-branch architecture.
- No arbitrary package sizes.

## 6. System Overview

```text
Browser
  Admin HTML/CSS/JS screens
  Customer HTML/CSS/JS screens

Express.js application
  Auth routes
  Admin routes
  Customer routes
  Middleware
  Models/business logic

SQLite3 database
  admin_users
  customer_accounts
  package_purchases
  delivery_history
  admin_action_logs
```

The server renders HTML pages or serves HTML templates and static assets. Client-side JavaScript is used only for simple validation, loading states, confirmation dialogs, and small UI enhancements. All business rules and authorization are enforced on the server.

## 7. Folder Structure

Follow the Project Context folder conventions:

```text
/
  server.js
  package.json
  .env.example
  /database
    schema.sql
    migrations/
    sample-data.sql
    database.js
  /middleware
    auth.js
    validation.js
    error-handler.js
    logging.js
  /models
    admin-user.js
    customer-account.js
    package-purchase.js
    delivery-history.js
    reports.js
    cup-balance.js
  /routes
    auth.js
    admin.js
    customer.js
  /views
    admin/
      dashboard.html
      customers.html
      customer-detail.html
      add-customer.html
      reports.html
    customer/
      balance.html
    shared/
      admin-login.html
      customer-login.html
      error.html
  /public
    css/
      styles.css
    js/
      admin.js
      customer.js
      validation.js
  /tests
    customer-balance.test.js
    package-purchase.test.js
    delivery-history.test.js
    auth.test.js
    reports.test.js
```

HTML can be served with simple file templates or a lightweight template helper. Do not introduce a frontend framework for MVP.

## 8. Route Design

### Public/Auth Routes

- `GET /` redirects to `/admin/login`.
- `GET /admin/login` renders admin login.
- `POST /admin/login` authenticates admin.
- `POST /admin/logout` clears admin session.
- `GET /customer/login` renders customer login.
- `POST /customer/login` authenticates customer.
- `POST /customer/logout` clears customer session.

### Admin Routes

All `/admin/*` routes require admin authentication middleware.

- `GET /admin/dashboard` shows admin dashboard.
- `GET /admin/customers` shows customer list/search.
- `GET /admin/customers/new` shows add customer form.
- `POST /admin/customers` creates a customer account.
- `GET /admin/customers/:customerId` shows customer detail.
- `GET /admin/customers/:customerId/package-purchases` shows full package history.
- `GET /admin/customers/:customerId/deliveries` shows full delivery history.
- `POST /admin/customers/:customerId/package-purchases` records package purchase.
- `POST /admin/customers/:customerId/deliveries` records delivered cup quantity.
- `POST /admin/deliveries/:deliveryId/void` voids a mistaken delivery.
- `GET /admin/deliveries` shows paginated delivery history, newest first.
- `POST /admin/customers/:customerId/balance-link/regenerate` regenerates the shared balance token.

### Customer Routes

All `/customer/*` routes require customer authentication middleware.

- `GET /customer/balance` shows the authenticated customer's balance page.
- `GET /customer/package-history` shows the authenticated customer's full package history.
- `GET /customer/delivery-history` shows the authenticated customer's full delivery history.

Customer routes must never accept a customer id from the browser to decide whose data to show. The customer id must come from the session.

Shared balance access routes are read-only and do not require a customer session:

- `GET /customer/access/:token` shows the linked customer's read-only balance page.
- `GET /customer/access/:token/package-history` shows read-only full package history.
- `GET /customer/access/:token/delivery-history` shows read-only full delivery history.

Shared token routes must never expose payment amounts, admin navigation, or mutation actions.

## 9. API Design

The MVP can use standard HTML form posts for mutations and server-rendered pages for reads. Where JSON is useful, return the Project Context response shape:

```json
{
  "success": true,
  "data": {},
  "message": "Action completed"
}
```

Recommended form/JSON contracts:

### POST `/admin/customers`

Request fields:

- `name`
- `phone`
- `email` optional
- `loginIdentifier`
- `password`

Server behavior:

- Validate required fields.
- Check duplicate phone.
- Check duplicate login identifier.
- Hash password with bcrypt.
- Insert customer account.
- Redirect to customer detail or return JSON success.

### POST `/admin/customers/:customerId/package-purchases`

Request fields:

- `packageSize`: `10`, `20`, or `30`

Server behavior:

- Validate admin session.
- Validate package size.
- Calculate amount paid as `packageSize * 30.000 ₫`.
- Calculate bonus cups and total cups added.
- Insert package purchase.
- Increase customer current balance.
- Commit both operations in one SQLite transaction.

### POST `/admin/customers/:customerId/deliveries`

Request fields:

- `deliveredCups`: positive integer, defaults to `1`
- `note` optional

Server behavior:

- Validate admin session.
- Re-read current balance inside a transaction.
- Block if balance is `0`.
- Block if `deliveredCups > current_balance`.
- Decrease balance by delivered cup quantity.
- Insert delivery history row with `delivered_cups` and `balance_after`.
- Commit both operations in one SQLite transaction.

### POST `/admin/deliveries/:deliveryId/void`

Server behavior:

- Validate admin session.
- Load the delivery.
- Block if already voided.
- Restore delivered cups to the customer balance.
- Mark delivery with `voided_at` and `voided_by_admin_id`.
- Commit balance restoration and delivery update in one SQLite transaction.

### GET `/customer/balance`

Server behavior:

- Read customer id from session.
- Load customer current balance.
- Load package purchase history.
- Load delivery history newest first.
- Render customer balance page.

## 10. Database Design

Keep schema in `/database/schema.sql`. Use snake_case table and column names. Enable foreign keys on every SQLite connection.

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  login_identifier TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  balance_access_token TEXT NOT NULL UNIQUE,
  current_balance INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (current_balance >= 0)
);

CREATE TABLE package_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  package_size INTEGER NOT NULL,
  bonus_cups INTEGER NOT NULL,
  total_cups_added INTEGER NOT NULL,
  amount_paid_cents INTEGER NOT NULL DEFAULT 0,
  created_by_admin_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customer_accounts(id),
  FOREIGN KEY (created_by_admin_id) REFERENCES admin_users(id),
  CHECK (package_size IN (10, 20, 30)),
  CHECK (bonus_cups >= 0),
  CHECK (total_cups_added > 0),
  CHECK (amount_paid_cents >= 0)
);

CREATE TABLE delivery_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  delivered_cups INTEGER NOT NULL DEFAULT 1,
  balance_after INTEGER NOT NULL,
  note TEXT,
  created_by_admin_id INTEGER NOT NULL,
  delivery_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  voided_at TEXT,
  voided_by_admin_id INTEGER,
  FOREIGN KEY (customer_id) REFERENCES customer_accounts(id),
  FOREIGN KEY (created_by_admin_id) REFERENCES admin_users(id),
  FOREIGN KEY (voided_by_admin_id) REFERENCES admin_users(id),
  CHECK (delivered_cups > 0),
  CHECK (balance_after >= 0)
);

CREATE TABLE admin_action_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  admin_user_id INTEGER,
  action_type TEXT NOT NULL,
  target_type TEXT,
  target_id INTEGER,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_user_id) REFERENCES admin_users(id)
);

CREATE INDEX idx_customer_accounts_phone ON customer_accounts(phone);
CREATE INDEX idx_customer_accounts_login_identifier ON customer_accounts(login_identifier);
CREATE INDEX idx_customer_accounts_balance_access_token ON customer_accounts(balance_access_token);
CREATE INDEX idx_package_purchases_customer_id ON package_purchases(customer_id);
CREATE INDEX idx_package_purchases_created_at ON package_purchases(created_at);
CREATE INDEX idx_package_purchases_package_size ON package_purchases(package_size);
CREATE INDEX idx_delivery_history_customer_id ON delivery_history(customer_id);
CREATE INDEX idx_delivery_history_delivery_date ON delivery_history(delivery_date);
CREATE INDEX idx_customer_accounts_current_balance ON customer_accounts(current_balance);
```

Store money as integer cents to avoid floating-point rounding issues. The current package price is `30.000 ₫` per purchased cup, stored as cents in `amount_paid_cents`.

## 11. Business Logic Design

Business logic belongs in `/models`, not in route handlers.

### Package Calculation

Implement in `/models/cup-balance.js`:

```js
function calculatePackageCredits(packageSize) {
  if (packageSize === 10) {
    return { packageSize: 10, bonusCups: 1, totalCupsAdded: 11 };
  }

  if (packageSize === 20) {
    return { packageSize: 20, bonusCups: 2, totalCupsAdded: 22 };
  }

  if (packageSize === 30) {
    return { packageSize: 30, bonusCups: 3, totalCupsAdded: 33 };
  }

  throw new Error('Invalid package size. Package size must be 10, 20, or 30.');
}
```

### Package Purchase Recording

`recordPackagePurchase(customerId, packageSize, adminUserId)`:

- Validate package size.
- Calculate bonus cups and total cups.
- Calculate `amount_paid_cents = packageSize * 30.000 ₫ * 100`.
- Begin SQLite transaction.
- Insert `package_purchases`.
- Update `customer_accounts.current_balance = current_balance + total_cups_added`.
- Insert admin action log.
- Commit.
- Roll back on error.

### Delivery Recording

`recordDelivery(customerId, deliveredCups, adminUserId, note)`:

- Begin SQLite transaction.
- Validate delivered cup quantity is a positive integer.
- Read customer balance inside transaction.
- If balance is `0`, roll back and return business error.
- If delivered cup quantity is greater than current balance, roll back and return business error.
- Calculate `balanceAfter = currentBalance - deliveredCups`.
- Update customer current balance.
- Insert `delivery_history`.
- Insert admin action log.
- Commit.
- Roll back on error.

Delivery history must display reverse chronologically by `delivery_date DESC`.

### Delivery Voiding

`voidDelivery(deliveryId, adminUserId)`:

- Begin SQLite transaction.
- Load the delivery.
- Block if the delivery does not exist.
- Block if the delivery is already voided.
- Restore `delivered_cups` to the customer's current balance.
- Mark `voided_at` and `voided_by_admin_id`.
- Insert admin action log.
- Commit.
- Roll back on error.

### Shared Balance Token

Customer accounts have one `balance_access_token`. Token access uses `/customer/access/:token` and related read-only history routes. Regenerating the token replaces the stored value and invalidates the old link.

## 12. Authentication Strategy

Use separate admin and customer login flows with bcrypt and express-session.

Session data:

```js
req.session.user = {
  id: user.id,
  role: 'admin' | 'customer'
};
```

Middleware:

- `requireAdmin`: requires `req.session.user.role === 'admin'`.
- `requireCustomer`: requires `req.session.user.role === 'customer'`.
- `redirectIfAuthenticated`: optional convenience for login pages.

Password rules:

- Store only bcrypt hashes.
- Never store plain text passwords.
- Use a reasonable bcrypt cost factor such as `12`.
- Return generic invalid-login messages.

Session configuration:

- Use `SESSION_SECRET` from environment.
- Use `httpOnly` cookies.
- Use `secure: true` in production.
- Use `sameSite: 'lax'`.
- Clear session on logout.

CSRF:

- Implement CSRF protection for form posts.
- At minimum, use a CSRF token stored in the session and embedded in forms.
- Validate CSRF token server-side before protected mutations.

## 13. Authorization Strategy

Authorization is server-side only.

Rules:

- Admin routes require admin session.
- Customer routes require customer session.
- Customer data is loaded using the session customer id.
- Customers cannot pass arbitrary customer ids to view other accounts.
- Admin functions are not rendered in customer views.
- Admin-only route handlers must be protected even if links are hidden.
- Shared token routes render read-only customer data only and must not expose payment amounts or admin actions.

## 14. Reporting Design

Reports are simple SQL aggregates over existing tables.

Required metrics:

- Total customer accounts.
- Total recorded package revenue: `SUM(package_purchases.amount_paid_cents)`.
- Package purchases by package size: `GROUP BY package_size`.
- Total bonus cups granted: `SUM(package_purchases.bonus_cups)`.
- Total cups added: `SUM(package_purchases.total_cups_added)`.
- Total cups delivered: `SUM(delivery_history.delivered_cups)` where `voided_at IS NULL`.
- Total outstanding cup balance: `SUM(customer_accounts.current_balance)`.
- Low balance customers: `current_balance <= 5`.
- Dashboard recent deliveries: newest first, limited to 5 non-voided deliveries.
- Admin delivery history: newest first, paginated.

Revenue labels must say "Recorded package revenue" and must not imply accounting compliance.

## 15. Error Handling

Use consistent error handling across routes.

Rules:

- Wrap database operations in try-catch.
- Roll back transactions on errors.
- Log technical errors with route/action context.
- Show user-friendly messages in the UI.
- Never expose raw database errors to customers or admins.

Common business errors:

- Invalid login.
- Missing required fields.
- Duplicate phone.
- Duplicate login identifier.
- Invalid package size.
- Cannot record delivery because balance is 0.
- Database operation failed.

## 16. Frontend Design Approach

Use plain HTML, CSS, and JavaScript.

Frontend responsibilities:

- Client-side form validation for quick feedback.
- Loading states on submit buttons.
- Confirmation dialogs for destructive actions.
- Showing/hiding simple UI help text.

Server responsibilities:

- All authorization.
- All validation that affects data integrity.
- All package bonus calculations.
- All balance updates.
- All report queries.

Responsive design:

- Use CSS media queries.
- Make admin dashboard and customer balance pages mobile-friendly.
- Display current balance prominently on customer detail and customer balance pages.
- Keep forms simple and readable on phones.

## 17. Deployment Approach

Primary deployment: Railway or Render full-stack Node.js app.

Requirements:

- Persistent disk for SQLite database file.
- Environment variables for secrets and database path.
- HTTPS enabled for authentication pages.
- Daily automated SQLite backup.
- Health check endpoint.

Recommended environment variables:

```text
NODE_ENV=development
PORT=3000
DATABASE_PATH=./database/app.db
SESSION_SECRET=replace-with-long-random-secret
BCRYPT_ROUNDS=12
```

Production notes:

- Set `NODE_ENV=production`.
- Use a persistent volume path for `DATABASE_PATH`.
- Set cookie `secure: true` behind HTTPS.
- Back up the SQLite file daily.
- Test restore procedure before real customer use.

Local development:

```bash
npm install
npm run db:setup
npm run dev
```

Recommended scripts:

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "db:setup": "node database/setup.js",
  "test": "jest",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

## 18. Testing Strategy

Use focused tests around coffee business logic, database operations, authentication, and authorization.

### Unit Tests

Files:

- `/tests/customer-balance.test.js`
- `/tests/package-purchase.test.js`

Coverage:

- `10` package credits `11` cups.
- `20` package credits `22` cups.
- `30` package credits `33` cups.
- Invalid package size is rejected.
- Low balance threshold is `<= 5`.

### Database Tests

Files:

- `/tests/delivery-history.test.js`
- `/tests/customer-account.test.js`

Coverage:

- Add customer account.
- Prevent duplicate phone.
- Prevent duplicate login identifier.
- Record package purchase and update balance in one transaction.
- Record delivery and update balance in one transaction.
- Prevent delivery at zero balance.
- Delivery history returns newest first.

### Auth And Authorization Tests

File:

- `/tests/auth.test.js`

Coverage:

- Admin login success.
- Admin login failure.
- Customer login success.
- Customer login failure.
- Customer cannot access `/admin/*`.
- Admin-only actions reject unauthenticated requests.
- Customer can only access their own balance page.

### Reporting Tests

File:

- `/tests/reports.test.js`

Coverage:

- Total customer accounts.
- Recorded package revenue.
- Package purchases grouped by package size.
- Total bonus cups.
- Total cups added.
- Total cups delivered.
- Outstanding cups.
- Low balance customers.
- Recent deliveries.

### Manual Smoke Test

Before deployment:

- Admin logs in.
- Admin creates customer.
- Admin records 10-cup package and sees 11 credited cups.
- Admin records 20-cup package and sees 22 credited cups.
- Admin records 30-cup package and sees 33 credited cups.
- Admin records delivery and balance decreases by 1.
- Admin cannot record delivery at 0 balance.
- Customer logs in and sees only own balance/history.
- Customer cannot access admin dashboard.
- Reports show expected totals.

## 19. ADR Decisions

### ADR-001: Use Express With Vanilla Frontend

Decision: Use Node.js v22.x, Express.js v4.x, and vanilla HTML/CSS/JavaScript.

Reason: Project Context requires a simple single-language stack with minimal dependencies and easy maintainability.

Consequences: The app avoids frontend framework complexity, but developers must keep server-rendered views and client-side scripts organized.

### ADR-002: Use SQLite3 For MVP Persistence

Decision: Use SQLite3 as a file-based database.

Reason: The MVP needs low maintenance, low cost, and no external database infrastructure.

Consequences: Deployment must provide persistent disk and backups. Future scaling may require PostgreSQL, but that is not MVP scope.

### ADR-003: Use Current Balance Plus Auditable Histories

Decision: Store `current_balance` on customer accounts and keep package/delivery history rows.

Reason: Project Context specifies current balance and delivery/package records. This provides fast reads while preserving explainable history.

Consequences: Balance-changing operations must use database transactions so current balance and history cannot diverge.

### ADR-004: Use Authenticated Admin And Customer Accounts

Decision: Use bcrypt password hashes and express-session for admin and customer login.

Reason: Updated scope requires authenticated admin and customer accounts with strict route separation.

Consequences: The app must implement secure sessions, logout, role middleware, and CSRF protection.

### ADR-005: Separate Admin And Customer Route Areas

Decision: Use `/admin/*` for admin operations and `/customer/*` for customer operations.

Reason: Project Context explicitly requires route separation and server-side permission checks.

Consequences: Customer routes must never render admin navigation or accept arbitrary customer ids for data access.

### ADR-006: Package Sizes Are Fixed Business Rules

Decision: Only support package sizes `10`, `20`, and `30` with credits `11`, `22`, and `33`.

Reason: Package credits are core business rules and must be consistent everywhere.

Consequences: Invalid package sizes are blocked at UI, route validation, model logic, and database constraints.

### ADR-007: Reporting Uses SQL Aggregates

Decision: Generate reporting from SQL aggregate queries over `customer_accounts`, `package_purchases`, and `delivery_history`.

Reason: The dataset is small, and direct aggregates are simpler than maintaining reporting tables.

Consequences: Reports remain easy to reason about and can be optimized later if needed.

## 20. Implementation Risks

- SQLite data loss if production hosting lacks persistent disk or backups.
- Balance drift if package purchases or deliveries are not wrapped in transactions.
- Customer data exposure if customer routes use request parameters instead of session identity.
- Weak session security if `SESSION_SECRET`, cookie flags, or CSRF protection are skipped.
- Duplicate accounts if phone and login identifier uniqueness are not enforced.
- Business-rule inconsistency if package credit calculation is duplicated instead of centralized.

## 21. Recommended Implementation Order

1. Project scaffold and environment config.
2. SQLite schema, setup script, and database connection helper.
3. Business logic functions for package credits and balances.
4. Authentication middleware and login/logout flows.
5. Admin customer account creation and list/detail views.
6. Package purchase recording.
7. Delivery recording and delivery history.
8. Customer balance page.
9. Admin dashboard and reports.
10. Tests and deployment documentation.

## 22. Next Step

Review and approve this architecture. After approval, create implementation epics and stories using the Project Context, updated PRD, updated UX specification, and this architecture.
