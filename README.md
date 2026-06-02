# barista-coffee-membership

Web app to manage membership for the barista coffee.

## Local setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and set local values. For the initial owner account, set:

   ```text
   ADMIN_USERNAME=owner
   ADMIN_PASSWORD=change-me-now
   ```

3. Initialize the SQLite database and seed the initial admin user:

   ```sh
   npm run db:setup
   ```

   The setup command stores the admin password as a bcrypt hash and skips creation when the username already exists.

4. Start the app:

   ```sh
   npm start
   ```

5. Open `http://127.0.0.1:3000/admin/login` and log in with the admin credentials from `.env`.

## Phase 1 owner MVP routes

- `/admin/login` - owner login.
- `/admin/dashboard` - protected dashboard metrics, low-balance customers, and recent deliveries.
- `/admin/customers` - protected customer list and search.
- `/admin/customers/new` - protected add customer form.
- `/admin/customers/:customerId` - protected customer detail with current balance, package purchase form, delivery action, package history, and delivery history.
- `/admin/deliveries` - protected admin delivery history.

Customer login and customer self-service pages are intentionally not implemented in Phase 1.

## Tests

Run the automated test suite:

```sh
npm test
```
