# Development Objective

The objective of Story 3.1 was to implement the owner-facing customer account management capability that anchors the prepaid membership ledger. In the delivered application, this story is the point at which the admin portal stops being a general shell and becomes a real operational customer ledger. The owner can create customers, search them, open a durable detail page, and rely on the stored record as the source of truth for all later package, delivery, and balance-link workflows.

## Files Created

### `models/customer-account.js`

This file is the core implementation output for the story. It exists because customer management is not just UI work; it needs a model layer that understands how to create, search, and retrieve customer records safely.

Why it exists:

- To centralize customer ledger behavior in one place.
- To keep SQL out of the route handlers.
- To provide a reusable source of truth for later package and delivery stories.

What problem it solves:

- Prevents duplicated database logic across admin routes.
- Gives the application a consistent way to enforce required fields, uniqueness, password hashing, and customer lookup.
- Creates the data foundation needed for later customer portal and shared-link features.

How it works:

- Normalizes customer input by trimming identity fields.
- Enforces required `name`, `phone`, `loginIdentifier`, and `password`.
- Checks for duplicate phone numbers and duplicate login identifiers before insert.
- Hashes the password before storage using the existing password helper.
- Generates a unique `balance_access_token` for later read-only customer access.
- Inserts the customer into SQLite with `current_balance` initialized to zero.
- Exposes lookup functions for id, phone, login identifier, balance access token, and search.

The most important implementation detail is that this file does not treat customer creation as a one-time insert. It treats customer identity as a durable ledger record that later workflows can trust.

## Files Modified

### `routes/admin.js`

This file was updated to expose the owner-facing customer management experience.

Why it exists:

- The admin portal is where the owner performs customer operations.
- Customer account creation, search, and detail viewing belong in the protected owner interface.

What problem it solves:

- Without these route handlers, the model layer would exist but the owner would have no usable workflow.

How it works:

- `GET /admin/customers` renders the customer list and search interface.
- `GET /admin/customers/new` renders the add-customer form.
- `POST /admin/customers` creates a customer and redirects to the detail page.
- `GET /admin/customers/:customerId` renders the customer detail page.
- All routes are protected by `requireAdmin`, so customer management remains owner-only.
- Duplicate customer errors are handled gracefully and re-render the create form with a clear error message.

The customer detail page also became the anchor for later workflows because it shows the owner the current balance and identity data in one place.

### `database/schema.sql`

This file supports the persisted shape of customer records that the story depends on.

Why it exists:

- Customer management needs a schema that can support identity, password, balance, and future access-link behavior.

What problem it solves:

- Without the right columns and constraints, customer creation could not safely support later features.

How it works:

- The customer record includes fields for name, phone, email, login identifier, password hash, balance access token, and current balance.
- Uniqueness expectations are supported at the schema/model boundary.

### `tests/phase1-owner.test.js`

This file contains customer-management regression coverage that proves the delivered behavior works in practice.

Why it exists:

- Customer management is a business-critical ledger function and needs automated protection.

What problem it solves:

- It protects the owner ledger from regressions in required field handling, duplicate prevention, search, and protected access.

How it works:

- It builds an isolated SQLite database from the current schema.
- It seeds a valid admin user so the protected routes can be exercised.
- It creates customer records directly through the model and checks duplicate prevention.
- It verifies search returns the expected customer.
- It confirms unauthenticated access to customer management routes is redirected.

### `tests/e2e-owner-customer-flow.test.js`

This file extends the customer-management evidence into an owner workflow context.

Why it exists:

- Customer management is not isolated from the rest of the owner portal; it is part of the operational flow.

What problem it solves:

- It demonstrates that customer records can be created and then used by later admin workflows.

How it works:

- It uses a real authenticated owner session.
- It creates a customer through the admin flow and continues through the broader owner workflow path.

## Database Changes

### `customer_accounts` schema usage

Story 3.1 relies on the SQLite customer record structure already present in the application.

Why it exists:

- The owner needs a single persistent record per customer that later package and delivery stories can trust.

What problem it solves:

- It prevents the application from falling back to ad hoc records or in-memory customer state.

How it works:

- Customer rows store identity and access fields together.
- The row includes `current_balance` so later ledger operations can update one central record.
- `balance_access_token` is stored now so later shared balance access can use the same customer identity without a redesign.

No new production schema was added by this story beyond the customer-account structure required to support the management workflow.

## Routes Added

### No new route namespace was introduced

The story extends the existing admin route namespace rather than creating a separate app or a separate route group.

### Routes implemented or extended

- `GET /admin/customers`
- `GET /admin/customers/new`
- `POST /admin/customers`
- `GET /admin/customers/:customerId`

Why they exist:

- The owner needs a list view to search and review customers.
- The owner needs a create form for onboarding new members.
- The owner needs a redirect after creation to confirm the account exists.
- The owner needs a detail page to anchor later package and delivery operations.

How they work:

- All routes are owned by `routes/admin.js`.
- All are protected by owner authentication middleware.
- Customer creation delegates to `createCustomerAccount(...)`.
- Detail rendering uses `findCustomerById(...)` and customer-account data.

## Models Added

### `models/customer-account.js`

This is the primary model addition for the story and contains the business logic for customer identity and retrieval.

Key functions:

- `createCustomerAccount(...)`
- `searchCustomers(...)`
- `findCustomerById(...)`
- `findCustomerByPhone(...)`
- `findCustomerByLoginIdentifier(...)`
- `findCustomerByBalanceAccessToken(...)`
- `rotateCustomerBalanceAccessToken(...)`
- `backfillMissingBalanceAccessTokens(...)`

Why they exist:

- The story requires a clean model boundary for customer management and future access-link support.

What problem it solves:

- It keeps customer data access consistent and prevents the admin routes from becoming SQL-heavy and fragile.

How it works:

- Search queries aggregate the customer identity data needed for the list page.
- Lookup helpers support the create flow, duplicate checks, and later portal behavior.
- Token rotation logic lays the groundwork for the customer balance-link feature that later depends on the same customer ledger.

## UI Components Added

The story primarily extends existing admin UI rather than introducing a separate design system component library.

### Customer list page UI

Why it exists:

- The owner needs to find customer accounts quickly during daily shop operation.

What problem it solves:

- It prevents the owner from having to scan raw database records or remember customer identifiers manually.

How it works:

- The customer list page shows name, phone, email, login, current balance, status, and last delivery.
- A search field lets the owner filter by the most useful identity fields.
- A clear `Add customer` action provides a direct entry point for onboarding.

### Add customer form

Why it exists:

- The owner needs a simple way to create a customer record from the admin portal.

What problem it solves:

- It reduces setup friction and keeps account creation in the same tool the owner uses for the rest of the membership program.

How it works:

- The form captures name, phone, email, login identifier, and initial password.
- Required fields are explicit.
- Duplicate validation errors are shown inline through a rendered error box.

### Customer detail page

Why it exists:

- The owner needs one stable place to inspect a customer’s identity and balance.

What problem it solves:

- It provides the operational anchor for later purchases, deliveries, and balance-link actions.

How it works:

- The page renders the customer’s core identity fields and current balance.
- It becomes the handoff point for later workflow stories rather than a dead-end profile page.

## Business Logic Implemented

### Required-field enforcement

Why it exists:

- Customer records must be complete enough to function as ledger identities.

What problem it solves:

- Prevents invalid or unusable records from entering the system.

How it works:

- `createCustomerAccount(...)` trims and validates the required fields before writing to the database.

### Duplicate prevention

Why it exists:

- Phone numbers and login identifiers must remain unique to keep one customer record tied to one real person.

What problem it solves:

- Avoids duplicate identity records that would corrupt the membership ledger.

How it works:

- The model checks for an existing customer by phone and by login identifier before inserting the new record.
- Duplicate conditions are returned as specific business errors so the admin route can show clear messages.

### Password hashing

Why it exists:

- The customer account includes a password for later customer access, and that password must be stored securely.

What problem it solves:

- Protects customer credentials from being stored in plaintext.

How it works:

- `createCustomerAccount(...)` hashes the initial password before insert.

### Balance token generation

Why it exists:

- The application needs a durable access token for later read-only balance sharing.

What problem it solves:

- Prevents future balance-link features from requiring a schema redesign.

How it works:

- A cryptographically random token is generated and checked for uniqueness before being stored.

### Search logic

Why it exists:

- The owner must be able to find customer records fast during shop operations.

What problem it solves:

- Prevents slow or brittle manual lookup processes.

How it works:

- The search function accepts a term and queries name, phone, and login identifier fields.
- When no search term is provided, it returns a stable ordered list of customers.

## Validation Rules

The validation rules in this story are business rules, not just UI constraints.

1. Name is required.
2. Phone is required.
3. Login identifier is required.
4. Password is required.
5. Email is optional.
6. Phone values must be unique.
7. Login identifiers must be unique.
8. Phone and login identifier values are trimmed before use.

Why these rules exist:

- They define the minimum data required for a durable customer ledger record.

What problem they solve:

- They prevent unusable, duplicate, or ambiguous customer entries from polluting the data set.

How they work:

- Validation is performed in the model before insert.
- Duplicate issues return explicit error codes so the route layer can render business-friendly messages.

## Security Controls

Story 3.1 introduces and relies on several security controls:

1. Owner authentication protects all customer-management routes.
2. Customer passwords are hashed before storage.
3. Duplicate identity checks reduce misuse and misattribution of records.
4. The detail page remains inside the owner portal rather than exposing customer data publicly.

Why they exist:

- Customer identity data is sensitive operational data and must not be exposed or stored carelessly.

What problem they solve:

- They prevent unauthorized access to customer records and protect customer credentials.

How they work:

- Protected admin routes require the authenticated owner session.
- Passwords are handled by the shared hashing helper.
- The customer-management model rejects duplicate identity data before insert.

## Test Coverage

The delivered implementation is supported by automated tests covering:

1. Customer creation success
2. Duplicate phone rejection
3. Duplicate login identifier rejection
4. Customer search behavior
5. Protected-route access for customer management
6. Customer account use in broader owner workflows

Why the tests exist:

- Customer management is foundational and must remain reliable as the application grows.

What problem they solve:

- They protect the app from regressions in the identity records that later workflows depend on.

How they work:

- Tests create isolated SQLite databases.
- Tests seed admin access for protected route checks.
- Tests create customer records through the actual model.
- Tests inspect search and redirect behavior at the HTTP and model levels.

The story’s test coverage is appropriate because it verifies both data integrity and route behavior, which are the two aspects most likely to break customer management in a small Express application.
